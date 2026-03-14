import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
    FileText, MessageSquare, ShieldAlert, UserX, Server,
    CreditCard, Scale, RefreshCw, Mail, type LucideIcon
} from 'lucide-react';

const LAST_UPDATED = 'February 19, 2026';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            {/* Hero */}
            <div className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold tracking-widest uppercase mb-6">
                        <FileText className="w-3.5 h-3.5" />
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display tracking-tight">Terms of Service</h1>
                    <p className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto">
                        By accessing or using Imagnest you agree to be bound by these Terms.
                        Please read them carefully before using the service.
                    </p>
                    <p className="text-gray-600 text-xs mt-4">Last updated: {LAST_UPDATED}</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-6">

                {/* Telegram notice */}
                <div className="rounded-2xl border border-[#1da1f2]/30 bg-[#1da1f2]/5 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-xl bg-[#1da1f2]/20 shrink-0 mt-0.5">
                            <MessageSquare className="w-5 h-5 text-[#1da1f2]" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-1">Third-Party Infrastructure — Telegram</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Imagnest stores image files via the <strong className="text-white">Telegram Bot API</strong>.
                                By using this service you also agree to{' '}
                                <a href="https://telegram.org/tos" target="_blank" rel="noopener noreferrer" className="text-[#1da1f2] hover:underline">
                                    Telegram&apos;s Terms of Service
                                </a>.
                                Imagnest is an independent platform and is <em>not</em> affiliated with, endorsed by, or sponsored by Telegram Messenger Inc.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 1 — Acceptance */}
                <TermsSection icon={FileText} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" title="1. Acceptance of Terms">
                    <p>
                        By creating an account or using any part of the Imagnest platform (&quot;Service&quot;), you confirm that you
                        are at least 13 years of age, have read and understood these Terms, and agree to be legally bound by them.
                        If you are using the Service on behalf of an organisation, you also represent that you have authority to bind that organisation.
                    </p>
                </TermsSection>

                {/* 2 — Telegram Compliance */}
                <TermsSection icon={MessageSquare} color="text-sky-400" bg="bg-sky-500/10" border="border-sky-500/20" title="2. Telegram Compliance">
                    <p className="mb-3">
                        Because image files are physically stored on Telegram&apos;s infrastructure, your use of Imagnest is subject to
                        Telegram&apos;s own policies in addition to these Terms. Specifically you agree to:
                    </p>
                    <ul className="space-y-3">
                        <ListItem title="Comply with Telegram ToS">Not upload, transmit, or store content that would violate Telegram&apos;s Terms of Service or Community Guidelines.</ListItem>
                        <ListItem title="No automated abuse">Not use bots, scripts, or automation to flood Telegram&apos;s Bot API beyond normal usage, which could result in your bot token being revoked.</ListItem>
                        <ListItem title="Accept Telegram data retention">Understand that even after deletion from Imagnest, Telegram may retain file data on their servers per their own policies — outside our control.</ListItem>
                        <ListItem title="No Telegram impersonation">Not create content that impersonates Telegram or implies an official affiliation with Telegram Messenger Inc.</ListItem>
                    </ul>
                </TermsSection>

                {/* 3 — Prohibited Content */}
                <TermsSection icon={ShieldAlert} color="text-red-400" bg="bg-red-500/10" border="border-red-500/20" title="3. Prohibited Content &amp; Uses">
                    <p className="mb-3">You may <strong className="text-white">not</strong> use Imagnest to upload, host, share, or distribute:</p>
                    <ul className="space-y-3 mb-4">
                        <ListItem title="Illegal content">Content that is illegal in your jurisdiction or the jurisdiction where our servers are located, including CSAM, non-consensual intimate imagery, or content facilitating crime.</ListItem>
                        <ListItem title="Copyrighted material">Images, artwork, or media you do not own or have explicit permission to redistribute.</ListItem>
                        <ListItem title="Malware or exploits">Files containing viruses, trojans, ransomware, spyware, or any other malicious code.</ListItem>
                        <ListItem title="Spam">Mass distribution of unsolicited content, phishing pages, or deceptive links.</ListItem>
                        <ListItem title="Hateful or violent content">Content that promotes discrimination, incites violence, or targets individuals or groups based on protected characteristics.</ListItem>
                        <ListItem title="Adult content (free plan)">Explicit adult content may only be uploaded on verified Pro/Enterprise accounts where legally permitted and properly labelled.</ListItem>
                    </ul>
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-200/80">
                        <strong className="text-red-300">Enforcement:</strong> Violations may result in immediate content removal, account suspension, or permanent ban without prior notice.
                        We cooperate with law enforcement and may report illegal content as required by law.
                    </div>
                </TermsSection>

                {/* 4 — Account Responsibilities */}
                <TermsSection icon={UserX} color="text-orange-400" bg="bg-orange-500/10" border="border-orange-500/20" title="4. Account Responsibilities">
                    <ul className="space-y-3">
                        <ListItem title="Account security">You are responsible for maintaining the security of your account and all activity that occurs under it.</ListItem>
                        <ListItem title="Accurate information">You must provide accurate registration information and keep it up to date.</ListItem>
                        <ListItem title="One account per person">Creating multiple accounts to circumvent plan limits, bans, or rate limits is prohibited.</ListItem>
                        <ListItem title="API key security">Your API keys are confidential. Do not embed them in public repositories or client-side code. Rotate them immediately if compromised.</ListItem>
                        <ListItem title="Notify us of breaches">If you suspect unauthorised access to your account, notify us at security@imagnest.com immediately.</ListItem>
                    </ul>
                </TermsSection>

                {/* 5 — Service Availability */}
                <TermsSection icon={Server} color="text-cyan-400" bg="bg-cyan-500/10" border="border-cyan-500/20" title="5. Service Availability &amp; Limitations">
                    <ul className="space-y-3">
                        <ListItem title="Best-effort uptime">We target 99.9% uptime but cannot guarantee uninterrupted service. Downtime may result from Telegram API outages, maintenance windows, or force majeure events.</ListItem>
                        <ListItem title="Rate limits">All endpoints are rate-limited per plan. Exceeding limits returns HTTP 429. Persistent abuse may result in temporary or permanent suspension.</ListItem>
                        <ListItem title="Storage quotas">Each plan has storage and image count limits. Exceeding your quota will block new uploads until you upgrade or delete existing images.</ListItem>
                        <ListItem title="File size limits">Individual uploads are capped at the limit defined in your plan. Files exceeding the limit will be rejected.</ListItem>
                        <ListItem title="No SLA on free tier">The free plan is provided as-is with no uptime guarantee or priority support.</ListItem>
                    </ul>
                </TermsSection>

                {/* 6 — Billing */}
                <TermsSection icon={CreditCard} color="text-green-400" bg="bg-green-500/10" border="border-green-500/20" title="6. Billing &amp; Subscriptions">
                    <ul className="space-y-3">
                        <ListItem title="Recurring charges">Paid plans are billed monthly or annually in advance. You authorise us to charge your payment method on renewal.</ListItem>
                        <ListItem title="No refunds">All payments are non-refundable except where required by applicable consumer protection law.</ListItem>
                        <ListItem title="Plan changes">Upgrades take effect immediately. Downgrades take effect at the end of the current billing period.</ListItem>
                        <ListItem title="Failed payments">If payment fails, we will retry for up to 7 days before downgrading your account to the free tier.</ListItem>
                        <ListItem title="Price changes">We may change pricing with 30 days notice. Continued use after the notice period constitutes acceptance.</ListItem>
                    </ul>
                </TermsSection>

                {/* 7 — Intellectual Property */}
                <TermsSection icon={Scale} color="text-pink-400" bg="bg-pink-500/10" border="border-pink-500/20" title="7. Intellectual Property &amp; Liability">
                    <ul className="space-y-3 mb-4">
                        <ListItem title="Your content">You retain full ownership of the images you upload. By uploading, you grant us a limited, non-exclusive licence to store, cache, and serve your images solely for the purpose of operating the Service.</ListItem>
                        <ListItem title="Our platform">The Imagnest platform, branding, and code are our intellectual property. You may not copy, reverse-engineer, or create derivative works without written permission.</ListItem>
                        <ListItem title="DMCA takedowns">If you believe your copyright is being infringed, send a DMCA notice to dmca@imagnest.com. We will act within 48 hours.</ListItem>
                    </ul>
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-gray-400">
                        <strong className="text-gray-200">Limitation of liability:</strong> To the maximum extent permitted by law, Imagnest is not liable for indirect, incidental, special, or consequential damages
                        arising from your use of the Service, including data loss or service interruptions caused by third-party infrastructure (e.g. Telegram).
                    </div>
                </TermsSection>

                {/* 8 — Termination */}
                <TermsSection icon={UserX} color="text-yellow-400" bg="bg-yellow-500/10" border="border-yellow-500/20" title="8. Termination">
                    <p className="mb-3">Either party may terminate at any time:</p>
                    <ul className="space-y-3">
                        <ListItem title="By you">Delete your account from your dashboard. Your metadata will be removed within 30 days. Image files on Telegram are subject to Telegram&apos;s retention policies.</ListItem>
                        <ListItem title="By us">We may suspend or terminate your account immediately for ToS violations, non-payment, or prolonged inactivity (&gt;12 months on the free tier).</ListItem>
                        <ListItem title="Effect of termination">Upon termination all licences granted to you cease. You remain responsible for any charges accrued before termination.</ListItem>
                    </ul>
                </TermsSection>

                {/* 9 — Changes */}
                <TermsSection icon={RefreshCw} color="text-indigo-400" bg="bg-indigo-500/10" border="border-indigo-500/20" title="9. Changes to These Terms">
                    <p>
                        We may revise these Terms at any time. We will notify you of material changes via email or in-app notification at least 14 days before they take effect.
                        Continued use of the Service after the effective date constitutes acceptance of the revised Terms.
                        You can always find the current version at <code className="text-indigo-300 bg-white/5 px-1 rounded">/terms</code>.
                    </p>
                </TermsSection>

                {/* 10 — Contact */}
                <TermsSection icon={Mail} color="text-[#1da1f2]" bg="bg-[#1da1f2]/10" border="border-[#1da1f2]/20" title="10. Contact">
                    <p className="mb-3">For any questions about these Terms, reach us at:</p>
                    <ul className="space-y-2">
                        <ListItem title="General">
                            <a href="mailto:hello@imagnest.com" className="text-[#1da1f2] hover:underline">hello@imagnest.com</a>
                        </ListItem>
                        <ListItem title="Legal / Privacy">
                            <a href="mailto:privacy@imagnest.com" className="text-[#1da1f2] hover:underline">privacy@imagnest.com</a>
                        </ListItem>
                        <ListItem title="DMCA / Copyright">
                            <a href="mailto:dmca@imagnest.com" className="text-[#1da1f2] hover:underline">dmca@imagnest.com</a>
                        </ListItem>
                        <ListItem title="Security">
                            <a href="mailto:security@imagnest.com" className="text-[#1da1f2] hover:underline">security@imagnest.com</a>
                        </ListItem>
                    </ul>
                </TermsSection>

                {/* Footer note */}
                <div className="text-center pt-4 text-gray-600 text-xs">
                    By using Imagnest you agree to these Terms · Last updated {LAST_UPDATED}
                </div>
            </div>

            <Footer />
        </main>
    );
}

/* ── helpers ── */

function TermsSection({
    icon: Icon, color, bg, border, title, children
}: {
    icon: LucideIcon;
    color: string;
    bg: string;
    border: string;
    title: string;
    children: React.ReactNode;
}) {
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
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
            <span>
                <strong className="text-gray-200">{title}:</strong>{' '}
                {children}
            </span>
        </li>
    );
}

