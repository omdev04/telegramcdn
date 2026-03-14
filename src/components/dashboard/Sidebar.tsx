'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Image as ImageIcon,
    Upload,
    BarChart2,
    Settings,
    CreditCard,
    Key,
    Bug,
    Zap,
} from 'lucide-react';
import { PLANS } from '@/config/plans';
import { useDashboard } from '@/contexts/DashboardContext';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload', href: '/dashboard/upload', icon: Upload },
    { name: 'Images', href: '/dashboard/images', icon: ImageIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
    { name: 'Plans', href: '/dashboard/plans', icon: CreditCard },
    { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
    { name: 'Bug Report', href: '/dashboard/bug-report', icon: Bug },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const { plan, usage } = useDashboard();

    const currentPlan = PLANS[plan] ?? PLANS['free'];
    const imageLimit = usage?.maxImages || currentPlan.limits.maxImages;
    const totalImages = usage?.totalImages || 0;
    const usedPercentage = Math.min(100, Math.round((totalImages / imageLimit) * 100));

    const isFreePlan = plan === 'free';

    return (
        <div className="flex h-full w-64 flex-col bg-[#000000] border-r border-[#242628]">
            {/* Logo */}
            <div className="flex h-20 shrink-0 items-center px-6">
                <Link href="/dashboard">
                    <Image
                        src="/logo/logo.png"
                        alt="Logo"
                        width={120}
                        height={120}
                        className="transition-opacity hover:opacity-80"
                    />
                </Link>
            </div>

            {/* Nav — scrollable */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
                <ul role="list" className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-[#1da1f2]/10 text-[#1da1f2] border border-[#1da1f2]/20'
                                            : 'text-[#72767a] hover:text-[#e7e9ea] hover:bg-white/5 border border-transparent'
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            'h-5 w-5 shrink-0 transition-colors',
                                            isActive ? 'text-[#1da1f2]' : 'text-[#72767a] group-hover:text-[#e7e9ea]'
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Plan box — always visible, never clipped */}
            <div className="shrink-0 px-4 pb-4">
                <div className="rounded-xl bg-[#0a0e1a] p-4 border border-[#2f3336]">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-[#72767a] mb-0.5">Current Plan</p>
                            <p className="text-sm font-semibold text-white leading-none">{currentPlan.name}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                            Active
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-2">
                        <div className="flex justify-between text-[10px] text-[#72767a] mb-1.5">
                            <span>Images used</span>
                            <span>{totalImages.toLocaleString()} / {imageLimit.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-[#16181c] rounded-full h-1.5 overflow-hidden border border-[#2f3336]">
                            <div
                                className={cn(
                                    'h-full rounded-full transition-all duration-500',
                                    usedPercentage >= 90
                                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                        : usedPercentage >= 70
                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
                                        : 'bg-gradient-to-r from-[#1da1f2] to-[#1c9cf0]'
                                )}
                                style={{ width: `${usedPercentage}%` }}
                            />
                        </div>
                        <div className="flex justify-end mt-1">
                            <span className={cn(
                                'text-[10px]',
                                usedPercentage >= 90 ? 'text-red-400' : usedPercentage >= 70 ? 'text-yellow-400' : 'text-[#72767a]'
                            )}>
                                {usedPercentage}% used
                            </span>
                        </div>
                    </div>

                    {/* Upgrade CTA for free plan */}
                    {isFreePlan && (
                        <Link
                            href="/dashboard/plans"
                            className="mt-1 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-[#1da1f2]/10 border border-[#1da1f2]/20 text-[#1da1f2] text-xs font-medium hover:bg-[#1da1f2]/20 transition-colors"
                        >
                            <Zap className="h-3 w-3" />
                            Upgrade Plan
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};
