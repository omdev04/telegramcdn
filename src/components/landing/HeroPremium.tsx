'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ImageIcon, Zap, ShieldCheck, Globe } from 'lucide-react';
import InfiniteGallery from '@/components/ui/InfiniteGallery';

const stats = [
    { label: 'Images Hosted', value: '500K+' },
    { label: 'Avg. Load Time', value: '<80ms' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'Storage Backend', value: 'Telegram' },
];

const pills = [
    { icon: ShieldCheck, label: 'Privacy First' },
    { icon: Zap, label: 'Edge Cached' },
    { icon: Globe, label: 'Global CDN' },
    { icon: ImageIcon, label: 'Any Format' },
];

export const HeroPremium = () => {
    const galleryImages = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
        'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=1200&q=80',
        'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=1200&q=80',
        'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&q=80',
        'https://images.unsplash.com/photo-1618556450783-3c2a58c0f1d6?w=1200&q=80',
        'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=1200&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
        'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=1200&q=80',
    ];

    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-black">

            {/* ── Background Gallery ── */}
            <div className="absolute inset-0 z-0">
                <InfiniteGallery
                    images={galleryImages}
                    speed={1}
                    visibleCount={12}
                    disableScroll={true}
                    className="h-full w-full"
                    fadeSettings={{ fadeIn: { start: 0.05, end: 0.25 }, fadeOut: { start: 0.4, end: 0.43 } }}
                    blurSettings={{ blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.4, end: 0.43 }, maxBlur: 8.0 }}
                />
            </div>

            {/* ── Overlays ── */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/75 to-black z-[1]" />
            {/* Top glow */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#1da1f2]/15 blur-[140px] rounded-full pointer-events-none z-[2]" />
            {/* Bottom-left accent */}
            <div className="absolute bottom-0 left-[-5%] w-[500px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-[2]" />

            {/* ── Content ── */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-28 pb-20 flex flex-col items-center text-center">

                {/* Top badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1da1f2]/30 bg-[#1da1f2]/10 text-[#1da1f2] text-xs font-semibold tracking-widest uppercase mb-8 backdrop-blur-sm"
                >
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1da1f2] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1da1f2]" />
                    </span>
                    Production-Ready Image Infrastructure
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    className="text-5xl sm:text-6xl md:text-[82px] font-bold tracking-tight leading-[1.05] text-white mb-6 font-display"
                >
                    Store, serve &amp; scale
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1da1f2] via-[#60c8ff] to-[#a78bfa]">
                        your images — fast.
                    </span>
                </motion.h1>

                {/* Sub-headline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed mb-10"
                >
                    A privacy-first image CDN powered by Telegram storage — with token-secured delivery,
                    global caching, API access and a full-featured dashboard. No S3 bills. No complexity.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-3 mb-14"
                >
                    <Link href="/dashboard">
                        <button className="group inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[#1da1f2] hover:bg-[#1a91da] text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.03] shadow-[0_0_28px_-4px_rgba(29,161,242,0.6)]">
                            Get Started Free
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </Link>
                    <Link href="#features">
                        <button className="inline-flex items-center gap-2 h-12 px-7 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-semibold text-sm transition-all duration-200 backdrop-blur-sm">
                            See How It Works
                        </button>
                    </Link>
                </motion.div>

                {/* Feature pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="flex flex-wrap justify-center gap-2 mb-16"
                >
                    {pills.map(({ icon: Icon, label }) => (
                        <span
                            key={label}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium"
                        >
                            <Icon className="w-3.5 h-3.5 text-[#1da1f2]" />
                            {label}
                        </span>
                    ))}
                </motion.div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.55 }}
                    className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10"
                >
                    {stats.map(({ label, value }) => (
                        <div key={label} className="bg-white/[0.03] hover:bg-white/[0.06] transition-colors px-6 py-5 flex flex-col items-center gap-1">
                            <span className="text-2xl font-bold text-white">{value}</span>
                            <span className="text-xs text-gray-500 font-medium">{label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
