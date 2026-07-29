"use client";

import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Users } from "lucide-react";

export const dynamic = "force-dynamic";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Transaction = {
    id: string;
    type: "payment" | "withdrawal" | "referral";
    amountPaise: number;
    status: string;
    createdAt: string;
    description: string;
};

export default function HistoryPage() {
    const { data: user, isLoading: userLoading } = useSWR("/api/user", fetcher);
    const { data: payments, isLoading: paymentsLoading } = useSWR("/api/payments", fetcher);
    const { data: withdrawals, isLoading: withdrawalsLoading } = useSWR("/api/withdrawals", fetcher);

    const isLoading = userLoading || paymentsLoading || withdrawalsLoading;

    if (isLoading) {
        return (
            <div className="p-10 text-center">
                <Loader2 className="animate-spin mx-auto" />
            </div>
        );
    }

    // Combine all transactions
    const transactions: Transaction[] = [
        ...(payments?.map((p: any) => ({
            id: p.id,
            type: "payment" as const,
            amountPaise: p.amountPaise,
            status: p.status,
            createdAt: p.createdAt,
            description: `Pro Upgrade Payment (Ref: ${p.upiRef})`,
        })) || []),
        ...(withdrawals?.map((w: any) => ({
            id: w.id,
            type: "withdrawal" as const,
            amountPaise: -w.amountPaise,
            status: w.status,
            createdAt: w.createdAt,
            description: `Withdrawal to ${w.upiId}`,
        })) || []),
        ...(user?.referralEvents?.map((r: any) => ({
            id: r.id,
            type: "referral" as const,
            amountPaise: r.amountPaise,
            status: "COMPLETED",
            createdAt: r.createdAt,
            description: r.type === "SIGNUP" ? "Referral Bonus" : "Pro Upgrade Commission",
        })) || []),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const getIcon = (type: Transaction["type"]) => {
        switch (type) {
            case "payment":
                return <CreditCard className="w-4 h-4 text-blue-600" />;
            case "withdrawal":
                return <Wallet className="w-4 h-4 text-red-600" />;
            case "referral":
                return <Users className="w-4 h-4 text-green-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-amber-100 text-amber-700";
            case "CONFIRMED":
            case "COMPLETED":
            case "PAID":
                return "bg-green-100 text-green-700";
            case "REJECTED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">Transaction History</h1>
                <p className="text-slate-500 text-sm">View all your payments, withdrawals, and earnings.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-1">
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Total Earned</span>
                        </div>
                        <p className="text-xl font-bold text-green-900">
                            ₹{((user?.totalEarnedPaise || 0) / 100).toFixed(0)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-1">
                            <ArrowDownRight className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">Total Withdrawn</span>
                        </div>
                        <p className="text-xl font-bold text-blue-900">
                            ₹{Math.abs(
                                withdrawals
                                    ?.filter((w: any) => w.status === "PAID")
                                    .reduce((sum: number, w: any) => sum + w.amountPaise, 0) / 100 || 0
                            ).toFixed(0)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction List */}
            <div>
                <h3 className="font-bold text-slate-900 mb-3">All Transactions</h3>
                <div className="space-y-3">
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <Card key={tx.id} className="overflow-hidden">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full ${
                                            tx.type === "payment" ? "bg-blue-50" :
                                            tx.type === "withdrawal" ? "bg-red-50" : "bg-green-50"
                                        }`}>
                                            {getIcon(tx.type)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 text-sm">{tx.description}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-xs text-slate-500">
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getStatusColor(tx.status)}`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${tx.amountPaise >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        {tx.amountPaise >= 0 ? "+" : ""}₹{(Math.abs(tx.amountPaise) / 100).toFixed(0)}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <p>No transactions yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

