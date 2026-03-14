import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Database, Eye, Lock, Share2, Bell, UserCheck, MessageSquare, type LucideIcon } from 'lucide-react';

const LAST_UPDATED = 'February 19, 2026';

const sections = [
    {
        id: 'overview',
        icon: Shield,
        color: 'text-[#1da1f2]',
        bg: 'bg-[#1da1f2]/10',
        border: 'border-[#1da1f2]/20',
        title: 'Overview',
        content: null,
    },
    {
        id: 'data-collection',
        icon: Database,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        title: 'Data We Collect',
        content: null,
    },
    {
        id: 'telegram-storage',
        icon: MessageSquare,
        color: 'text-sky-400',
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/20',
        title: 'Telegram as Storage Backend',
        content: null,
    },
    {
        id: 'image-access',
        icon: Eye,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        title: 'Image Access & Privacy Controls',
        content: null,
    },
    {
        id: 'data-security',
        icon: Lock,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        title: 'Data Security',
        content: null,
    },
    {
        id: 'data-sharing',
        icon: Share2,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        title: 'Data Sharing',
        content: null,
    },
    {
        id: 'user-rights',
        icon: UserCheck,
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        title: 'Your Rights',
        content: null,
    },
    {
        id: 'updates',
        icon: Bell,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        title: 'Policy Updates',
        content: null,
    },
];

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            {/* Hero */}
            <div className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#1da1f2]/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1da1f2]/30 bg-[#1da1f2]/10 text-[#1da1f2] text-xs font-semibold tracking-widest uppercase mb-6">
                        <Shield className="w-3.5 h-3.5" />
                        Legal &amp; Privacy
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display tracking-tight">Privacy Policy</h1>
                    <p className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto">
                        We are committed to protecting your data. This policy explains exactly what we collect,
                        how images are stored, and your rights as a user.
                    </p>
                    <p className="text-gray-600 text-xs mt-4">Last updated: {LAST_UPDATED}</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-6">

                {/* Important Telegram Note */}
                <div className="rounded-2xl border border-[#1da1f2]/30 bg-[#1da1f2]/5 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-xl bg-[#1da1f2]/20 shrink-0 mt-0.5">
                            <MessageSquare className="w-5 h-5 text-[#1da1f2]" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-1">Powered by Telegram Infrastructure</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Imagnest uses <strong className="text-white">Telegram's Bot API</strong> as its storage backend.
                                Your image files are stored on Telegram's servers and are subject to{' '}
                                <a href="https://telegram.org/privacy" target="_blank" rel="noopener noreferrer" className="text-[#1da1f2] hover:underline">
                                    Telegram's Privacy Policy
                                </a>{' '}
                                and{' '}
                                <a href="https://telegram.org/tos" target="_blank" rel="noopener noreferrer" className="text-[#1da1f2] hover:underline">
                                    Terms of Service
                                </a>.
                                We only store <em>metadata</em> (file IDs, names, sizes) in our own database — not the image files themselves.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 1 — Overview */}
                <PolicySection icon={Shield} color="text-[#1da1f2]" bg="bg-[#1da1f2]/10" border="border-[#1da1f2]/20" title="1. Overview">
                    <p>
                        Imagnest (&quot;we&quot;, &quot;our&quot;, &quot;the Service&quot;) is an image hosting and delivery platform.
                        We take your privacy seriously. This Privacy Policy describes what personal data we collect,
                        how we use it, and the choices you have. By using Imagnest you agree to the practices described here.
                    </p>
                </PolicySection>

                {/* Section 2 — Data Collection */}
                <PolicySection icon={Database} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" title="2. Data We Collect">
                    <p className="mb-4">We collect the minimum data needed to operate the service:</p>
                    <ul className="space-y-3">
                        <ListItem title="Account Information">Your name and email address, provided via Google OAuth. We never store your Google password.</ListItem>
                        <ListItem title="Image Metadata">Original filename, file size, MIME type, upload timestamp, view count, and the Telegram File ID. We do <em>not</em> store the raw image bytes on our servers.</ListItem>
                        <ListItem title="Usage Data">API request counts and storage consumption — used to enforce plan limits and prevent abuse.</ListItem>
                        <ListItem title="Session Data">A signed, encrypted session cookie (NextAuth) that expires when you log out. No tracking cookies.</ListItem>
                        <ListItem title="Access Logs">Server-side logs containing IP addresses and request timestamps, retained for up to 30 days for security and abuse prevention.</ListItem>
                    </ul>
                </PolicySection>

                {/* Section 3 — Telegram Storage */}
                <PolicySection icon={MessageSquare} color="text-sky-400" bg="bg-sky-500/10" border="border-sky-500/20" title="3. Telegram as Storage Backend">
                    <p className="mb-4">
                        Every image you upload is sent to a <strong className="text-white">private Telegram channel or bot chat</strong> via
                        the Telegram Bot API. This means:
                    </p>
                    <ul className="space-y-3 mb-4">
                        <ListItem title="Telegram stores the file">
                            The actual bytes of your image exist on Telegram's servers (Frankfurt, Netherlands, and Singapore data centres).
                            Telegram's infrastructure is governed by their own privacy policy.
                        </ListItem>
                        <ListItem title="We store only the reference">
                            We store the <code className="text-sky-300 bg-white/5 px-1 rounded">file_id</code> returned by Telegram.
                            This ID is used to retrieve and proxy the image through our CDN.
                        </ListItem>
                        <ListItem title="Telegram compliance">
                            By using Imagnest you agree not to upload content that violates{' '}
                            <a href="https://telegram.org/tos" target="_blank" rel="noopener noreferrer" className="text-[#1da1f2] hover:underline">Telegram's Terms of Service</a>.
                            Prohibited content includes but is not limited to: illegal material, spam, malware, or content infringing third-party intellectual property rights.
                        </ListItem>
                        <ListItem title="Telegram may retain data">
                            Telegram may retain files on their servers even after you delete an image from Imagnest.
                            We send a delete request to Telegram on your behalf, but we cannot guarantee immediate or permanent removal from their infrastructure.
                        </ListItem>
                    </ul>
                    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-200/80">
                        <strong className="text-yellow-300">Note:</strong> Because images physically reside on Telegram servers, requests for erasure under GDPR Art. 17 or similar regulations apply to
                        our metadata records. We will delete all metadata we hold and send a Telegram delete request. Final deletion from Telegram's systems is subject to Telegram's own retention policies.
                    </div>
                </PolicySection>

                {/* Section 4 — Image Access */}
                <PolicySection icon={Eye} color="text-cyan-400" bg="bg-cyan-500/10" border="border-cyan-500/20" title="4. Image Access &amp; Privacy Controls">
                    <ul className="space-y-3">
                        <ListItem title="Public images">
                            Accessible by anyone with the CDN link (<code className="text-cyan-300 bg-white/5 px-1 rounded">/api/cdn/:id</code>).
                            View counts are tracked and visible to you in your dashboard.
                        </ListItem>
                        <ListItem title="Private images (Pro/Enterprise)">
                            Served only with a valid signed token (<code className="text-cyan-300 bg-white/5 px-1 rounded">?token=…</code>).
                            Requests without a valid token receive a <code className="text-cyan-300 bg-white/5 px-1 rounded">401 Unauthorized</code> response.
                        </ListItem>
                        <ListItem title="Token rotation">
                            You can regenerate the access token for any private image at any time, instantly invalidating all old links.
                        </ListItem>
                        <ListItem title="CDN caching">
                            Public images may be cached at the edge. Privacy changes (public → private) may take up to 60 seconds to propagate through the cache layer.
                        </ListItem>
                    </ul>
                </PolicySection>

                {/* Section 5 — Security */}
                <PolicySection icon={Lock} color="text-green-400" bg="bg-green-500/10" border="border-green-500/20" title="5. Data Security">
                    <ul className="space-y-3">
                        <ListItem title="Encryption in transit">All data between your browser, our servers, and Telegram is transmitted over TLS 1.2+.</ListItem>
                        <ListItem title="Encrypted sessions">Session tokens are signed with a secret key and are HttpOnly, Secure and SameSite=Lax.</ListItem>
                        <ListItem title="Database security">MongoDB Atlas with network-level IP allowlisting and encrypted storage at rest.</ListItem>
                        <ListItem title="Rate limiting">All API endpoints are rate-limited per user and plan tier to prevent abuse and DoS attacks.</ListItem>
                        <ListItem title="No plaintext secrets">API keys and credentials are stored as environment variables and never committed to source control.</ListItem>
                    </ul>
                </PolicySection>

                {/* Section 6 — Data Sharing */}
                <PolicySection icon={Share2} color="text-orange-400" bg="bg-orange-500/10" border="border-orange-500/20" title="6. Data Sharing">
                    <p className="mb-4">We do <strong className="text-white">not</strong> sell, rent, or trade your personal data. We may share data in the following limited circumstances:</p>
                    <ul className="space-y-3">
                        <ListItem title="Telegram (storage provider)">Image files are transmitted to Telegram's servers as described in Section 3.</ListItem>
                        <ListItem title="Google (authentication)">OAuth 2.0 is used for login. We receive your name and email. Google's use of this data is governed by Google's Privacy Policy.</ListItem>
                        <ListItem title="Legal requirements">We may disclose your data if required by a valid court order, subpoena, or applicable law.</ListItem>
                        <ListItem title="Business transfer">In the event of a merger, acquisition, or sale of assets, your data may be transferred. We will notify you beforehand.</ListItem>
                    </ul>
                </PolicySection>

                {/* Section 7 — User Rights */}
                <PolicySection icon={UserCheck} color="text-pink-400" bg="bg-pink-500/10" border="border-pink-500/20" title="7. Your Rights">
                    <p className="mb-4">Depending on your jurisdiction you may have the following rights:</p>
                    <ul className="space-y-3">
                        <ListItem title="Access">Request a copy of the personal data we hold about you.</ListItem>
                        <ListItem title="Correction">Request correction of inaccurate or incomplete data.</ListItem>
                        <ListItem title="Deletion">Request deletion of your account and all associated metadata. Note the Telegram caveat in Section 3.</ListItem>
                        <ListItem title="Portability">Request an export of your data in a machine-readable format (JSON).</ListItem>
                        <ListItem title="Objection">Object to processing of your data for direct marketing (we don't do this) or legitimate interest grounds.</ListItem>
                    </ul>
                    <p className="mt-4">
                        To exercise any of these rights, email us at{' '}
                        <a href="mailto:privacy@imagnest.com" className="text-[#1da1f2] hover:underline">privacy@imagnest.com</a>.
                        We will respond within 30 days.
                    </p>
                </PolicySection>

                {/* Section 8 — Updates */}
                <PolicySection icon={Bell} color="text-yellow-400" bg="bg-yellow-500/10" border="border-yellow-500/20" title="8. Policy Updates">
                    <p>
                        We may update this Privacy Policy from time to time. When we do, we will update the &quot;Last updated&quot; date at the top of this page
                        and, for material changes, notify you via email or in-app notification. Continued use of the Service after changes
                        constitutes acceptance of the updated policy.
                    </p>
                </PolicySection>

                {/* Footer note */}
                <div className="text-center pt-4 text-gray-600 text-xs">
                    Questions? Contact us at{' '}
                    <a href="mailto:privacy@imagnest.com" className="text-[#1da1f2] hover:underline">privacy@imagnest.com</a>
                    {' '}· Last updated {LAST_UPDATED}
                </div>
            </div>

            <Footer />
        </main>
    );
}

/* ── helpers ── */

function PolicySection({
    icon: Icon, color, bg, border, title, children
}: {
    icon: LucideIcon;
    color: string;
    bg: string;
    border: string;
    title: string;
    children: React.ReactNode;
}): React.ReactNode {
    return (
        <div className={`rounded-2xl border ${border} bg-white/[0.02] p-6`}>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${bg} shrink-0`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <h2 className="text-white font-semibold text-lg">{title}</h2>
            </div>
            <div className="text-gray-400 text-sm leading-relaxed space-y-2">
                {children}
            </div>
        </div>
    );
}

function ListItem({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <li className="flex gap-3">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
            <span>
                <strong className="text-gray-200">{title}:</strong>{' '}
                {children}
            </span>
        </li>
    );
}

