"use client";

import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CreditCard, Wallet, Crown, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminPage() {
    const { data: payments } = useSWR("/api/admin/payments", fetcher);
    const { data: withdrawals } = useSWR("/api/admin/withdrawals", fetcher);
    const { data: users } = useSWR("/api/admin/users", fetcher);

    const pendingPayments = payments?.filter((p: any) => p.status === "PENDING").length || 0;
    const pendingWithdrawals = withdrawals?.filter((w: any) => w.status === "PENDING").length || 0;
    const totalUsers = users?.length || 0;
    const proUsers = users?.filter((u: any) => u.isPro).length || 0;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white animate-fade-in">Admin Overview</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
                <StatsCard
                    title="Pending Payments"
                    value={pendingPayments}
                    icon={<CreditCard className="w-5 h-5 text-amber-400" />}
                    bg="bg-amber-500/10"
                    border="border-amber-500/20"
                    href="/admin/payments"
                />
                <StatsCard
                    title="Pending Withdrawals"
                    value={pendingWithdrawals}
                    icon={<Wallet className="w-5 h-5 text-red-400" />}
                    bg="bg-red-500/10"
                    border="border-red-500/20"
                    href="/admin/withdrawals"
                />
                <StatsCard
                    title="Total Users"
                    value={totalUsers}
                    icon={<Users className="w-5 h-5 text-blue-400" />}
                    bg="bg-blue-500/10"
                    border="border-blue-500/20"
                    href="/admin/users"
                />
                <StatsCard
                    title="Pro Members"
                    value={proUsers}
                    icon={<Crown className="w-5 h-5 text-amber-400" />}
                    bg="bg-amber-500/10"
                    border="border-amber-500/20"
                    href="/admin/users"
                />
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, bg, border, href }: any) {
    return (
        <Link href={href}>
            <Card className="bg-slate-900/40 backdrop-blur-md border-white/5 shadow-lg hover:bg-slate-900/60 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4 flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${bg} ${border} border group-hover:scale-110 transition-transform`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{title}</p>
                        <h3 className="text-2xl font-bold text-white">{value}</h3>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
