'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    TrendingUp,
    Image as ImageIcon,
    Eye,
    HardDrive,
    Activity,
    BarChart3,
    Crown,
    ArrowUpRight,
    RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalyticsData {
    overview: {
        totalImages: number;
        totalViews: number;
        totalSize: number;
        avgUploadsPerDay: number;
        avgViewsPerImage: number;
    };
    timeline: Array<{ date: string; uploads: number; views: number }>;
    imagesByType: { [key: string]: number };
    topImages: Array<{ id: string; views: number; createdAt: string; size: number }>;
    dateRange: { start: string; end: string; days: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const PIE_COLORS = ['#1da1f2', '#a855f7', '#22d3ee', '#34d399', '#fb923c', '#f472b6'];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#0a0e1a] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
            <p className="text-gray-400 mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color }} className="font-semibold">
                    {p.name}: {p.value.toLocaleString()}
                </p>
            ))}
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

const STAT_COLORS: Record<string, string> = {
    blue: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/20',
    purple: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/20',
    cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/20',
    green: 'from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/20',
    orange: 'from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/20',
};

function StatCard({ icon: Icon, label, value, sub, color }: {
    icon: any; label: string; value: string; sub?: string; color: string;
}) {
    const cls = STAT_COLORS[color];
    const [iconGrad, borderCls, textCls] = [
        cls.split(' ').slice(0, 2).join(' '),
        cls.split(' ')[3],
        cls.split(' ')[2],
    ];
    return (
        <div className={`bg-white/[0.03] border ${borderCls} rounded-2xl p-5 flex flex-col gap-3`}>
            <div className={`inline-flex p-2 bg-gradient-to-br ${iconGrad} rounded-xl w-fit`}>
                <Icon className={`h-5 w-5 ${textCls}`} />
            </div>
            <div>
                <div className="text-2xl font-bold text-white">{value}</div>
                {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
                <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
        </div>
    );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function Card({ title, icon: Icon, iconColor, children }: {
    title: string; icon?: any; iconColor?: string; children: React.ReactNode;
}) {
    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            {title && (
                <div className="flex items-center gap-2 mb-5">
                    {Icon && <Icon className={`h-5 w-5 ${iconColor ?? 'text-gray-400'}`} />}
                    <h2 className="text-base font-semibold text-white">{title}</h2>
                </div>
            )}
            {children}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [requiresUpgrade, setRequiresUpgrade] = useState(false);
    const [timeRange, setTimeRange] = useState(30);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => { fetchAnalytics(); }, [timeRange]);

    const fetchAnalytics = async (manual = false) => {
        try {
            manual ? setRefreshing(true) : setLoading(true);
            const res = await axios.get(`/api/analytics?days=${timeRange}`);
            setAnalytics(res.data.analytics);
            setRequiresUpgrade(false);
        } catch (error: any) {
            if (error.response?.data?.requiresUpgrade) setRequiresUpgrade(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="space-y-6 max-w-7xl animate-pulse">
                <div className="h-10 w-48 bg-white/5 rounded-xl" />
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-28 bg-white/5 rounded-2xl" />
                    ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="h-72 bg-white/5 rounded-2xl" />
                    <div className="h-72 bg-white/5 rounded-2xl" />
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="h-72 bg-white/5 rounded-2xl" />
                    <div className="h-72 bg-white/5 rounded-2xl" />
                </div>
            </div>
        );
    }

    // ── Upgrade gate ──────────────────────────────────────────────────────────
    if (requiresUpgrade) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <div className="mb-6 p-5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full">
                    <Crown className="h-16 w-16 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Analytics Requires Pro</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                    Unlock powerful insights about your images with detailed charts and metrics.
                    Upgrade to Pro or Enterprise to access this feature.
                </p>
                <Link
                    href="/dashboard/plans"
                    className="px-8 py-3 bg-gradient-to-r from-[#1da1f2] to-[#1a8cd8] hover:from-[#1a8cd8] hover:to-[#1777bd] rounded-xl font-semibold text-white transition-all hover:scale-105 shadow-lg shadow-[#1da1f2]/20"
                >
                    Upgrade to Pro
                </Link>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                No analytics data available.
            </div>
        );
    }

    // ── Derived data ──────────────────────────────────────────────────────────

    // Thin out timeline labels so X-axis isn't crowded
    const tickInterval = Math.max(1, Math.floor(analytics.timeline.length / 7));
    const timelineData = analytics.timeline.map((d, i) => ({
        ...d,
        label: i % tickInterval === 0 ? formatDate(d.date) : '',
        shortDate: formatDate(d.date),
    }));

    // Pie data for image types
    const pieData = Object.entries(analytics.imagesByType).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: count,
    }));

    // Bar data: top 5 images
    const barData = analytics.topImages.slice(0, 5).map((img, i) => ({
        name: `#${i + 1}`,
        views: img.views,
        id: img.id,
    }));

    return (
        <div className="space-y-6 max-w-7xl">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {formatDate(analytics.dateRange.start)} – {formatDate(analytics.dateRange.end)}
                        &nbsp;·&nbsp;{analytics.dateRange.days} days
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchAnalytics(true)}
                        disabled={refreshing}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                        {[7, 30, 90].map(d => (
                            <button
                                key={d}
                                onClick={() => setTimeRange(d)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeRange === d ? 'bg-[#1da1f2] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                            >
                                {d}d
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard icon={ImageIcon} label="Total Images" value={analytics.overview.totalImages.toLocaleString()} color="blue" />
                <StatCard icon={Eye} label="Total Views" value={analytics.overview.totalViews.toLocaleString()} color="purple" />
                <StatCard icon={HardDrive} label="Storage Used" value={formatBytes(analytics.overview.totalSize)} color="cyan" />
                <StatCard icon={TrendingUp} label="Avg Uploads / Day" value={analytics.overview.avgUploadsPerDay.toFixed(1)} sub={`over ${timeRange}d`} color="green" />
                <StatCard icon={Activity} label="Avg Views / Image" value={analytics.overview.avgViewsPerImage.toFixed(1)} color="orange" />
            </div>

            {/* ── Combined Timeline Area Chart ── */}
            <Card title="Activity Overview" icon={BarChart3} iconColor="text-[#1da1f2]">
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={timelineData} margin={{ top: 4, right: 30, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="uploadsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1da1f2" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#1da1f2" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis
                            dataKey="shortDate"
                            tick={{ fill: '#6b7280', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            interval={tickInterval - 1}
                            padding={{ left: 50, right: 50 }}
                        />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend
                            formatter={(v) => <span className="text-gray-300 text-xs capitalize">{v}</span>}
                            wrapperStyle={{ paddingTop: 12 }}
                        />
                        <Area type="monotone" dataKey="uploads" name="Uploads" stroke="#1da1f2" strokeWidth={2} fill="url(#uploadsGrad)" dot={false} activeDot={{ r: 4 }} />
                        <Area type="monotone" dataKey="views" name="Views" stroke="#a855f7" strokeWidth={2} fill="url(#viewsGrad)" dot={false} activeDot={{ r: 4 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            {/* ── Pie + Bar Charts ── */}
            <div className="grid lg:grid-cols-2 gap-6">

                {/* Pie: image type distribution */}
                <Card title="Image Type Distribution" icon={Activity} iconColor="text-cyan-400">
                    {pieData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">No data</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={65}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any, name: any) => [
                                        value != null ? `${value} (${((value / analytics.overview.totalImages) * 100).toFixed(1)}%)` : '0',
                                        name ?? '',
                                    ]}
                                    contentStyle={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                />
                                <Legend
                                    formatter={(v) => <span className="text-gray-300 text-xs">{v}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </Card>

                {/* Bar: top 5 images by views */}
                <Card title="Top 5 Images by Views" icon={TrendingUp} iconColor="text-purple-400">
                    {barData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">No data</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={barData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#a855f7" />
                                        <stop offset="100%" stopColor="#1da1f2" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    content={<ChartTooltip />}
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                />
                                <Bar dataKey="views" name="Views" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={56} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Card>
            </div>

            {/* ── Top Performing Images ── */}
            <Card title="Top Performing Images" icon={Eye} iconColor="text-purple-400">
                <div className="space-y-2">
                    {analytics.topImages.slice(0, 10).map((img, index) => {
                        const pct = analytics.overview.totalViews > 0
                            ? (img.views / analytics.overview.totalViews) * 100
                            : 0;
                        return (
                            <Link
                                key={img.id}
                                href={`/view/${img.id}`}
                                className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-[#1da1f2] to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">
                                    #{index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-white font-medium">
                                            {img.views.toLocaleString()} views
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {formatBytes(img.size)} · {formatDate(img.createdAt)}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#1da1f2] to-purple-500 rounded-full transition-all"
                                            style={{ width: `${Math.max(pct, 2)}%` }}
                                        />
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors shrink-0" />
                            </Link>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
