/**
 * Super Admin Creation Script
 * Usage:
 *   node scripts/make-superadmin.js <email>
 *   node scripts/make-superadmin.js list          <- list all admins/superadmins
 *   node scripts/make-superadmin.js demote <email> <- demote back to user
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' }); // fallback

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌  MONGODB_URI not found in .env.local or .env');
    process.exit(1);
}

// ── Inline User schema (mirrors src/models/User.ts) ──
const UserSchema = new mongoose.Schema({
    googleId:   { type: String },
    email:      { type: String },
    username:   { type: String },
    avatar:     { type: String },
    plan:       { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    apiKeys:    [{ type: String }],
    usage: {
        uploadsToday: { type: Number, default: 0 },
        totalImages:  { type: Number, default: 0 },
        storageUsed:  { type: Number, default: 0 },
    },
    role:           { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    status:         { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
    warnings:       { type: Number, default: 0 },
    strikes:        { type: Number, default: 0 },
    suspendedUntil: { type: Date },
    banReason:      { type: String },
    bannedAt:       { type: Date },
    lastLogin:      { type: Date },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// ── Helpers ──
function log(msg)     { console.log(`  ${msg}`); }
function ok(msg)      { console.log(`\n  ✅  ${msg}\n`); }
function fail(msg)    { console.error(`\n  ❌  ${msg}\n`); }
function divider()    { console.log('  ' + '─'.repeat(52)); }

function printUser(u) {
    divider();
    log(`Name     : ${u.username}`);
    log(`Email    : ${u.email || '(none)'}`);
    log(`Role     : ${u.role}`);
    log(`Plan     : ${u.plan}`);
    log(`Status   : ${u.status}`);
    log(`ID       : ${u._id}`);
    divider();
}

async function connect() {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
}

// ── Commands ──

async function promote(email) {
    await connect();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
        fail(`No user found with email: ${email}`);
        fail('The user must sign in at least once before being promoted.');
        process.exit(1);
    }

    if (user.role === 'superadmin') {
        log(`⚠️  ${email} is already a superadmin.`);
        printUser(user);
        process.exit(0);
    }

    const prevRole = user.role;
    user.role   = 'superadmin';
    user.plan   = 'enterprise';
    user.status = 'active';
    await user.save();

    ok(`Promoted ${email} from "${prevRole}" → superadmin (plan set to enterprise)`);
    printUser(user);
}

async function demote(email) {
    await connect();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
        fail(`No user found with email: ${email}`);
        process.exit(1);
    }

    const prevRole = user.role;
    user.role = 'user';
    await user.save();

    ok(`Demoted ${email} from "${prevRole}" → user`);
    printUser(user);
}

async function list() {
    await connect();

    const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } }).sort({ role: -1 });

    if (admins.length === 0) {
        log('No admins or superadmins found.');
    } else {
        console.log(`\n  Found ${admins.length} privileged account(s):\n`);
        admins.forEach(printUser);
    }
}

// ── Entry point ──

const args = process.argv.slice(2);
const cmd  = args[0];

(async () => {
    try {
        console.log('\n  🔧  Imagnest Super Admin Tool\n');

        if (!cmd || cmd === '--help' || cmd === '-h') {
            console.log('  Usage:');
            log('node scripts/make-superadmin.js <email>           — promote to superadmin');
            log('node scripts/make-superadmin.js demote <email>    — demote back to user');
            log('node scripts/make-superadmin.js list              — list all admins');
            console.log('');
            process.exit(0);
        }

        if (cmd === 'list') {
            await list();
        } else if (cmd === 'demote') {
            const email = args[1];
            if (!email) { fail('Usage: node scripts/make-superadmin.js demote <email>'); process.exit(1); }
            await demote(email);
        } else {
            // treat first arg as email → promote
            await promote(cmd);
        }

    } catch (err) {
        fail(`Unexpected error: ${err.message}`);
        console.error(err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
})();
