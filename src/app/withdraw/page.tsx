"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wallet, ArrowUpRight, History } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WithdrawPage() {
    const { data: user, mutate: mutateUser } = useSWR("/api/user", fetcher);
    const { data: withdrawals, mutate: mutateWithdrawals } = useSWR("/api/withdrawals", fetcher);

    const [amount, setAmount] = useState("");
    const [upiId, setUpiId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !upiId) return;

        const amountPaise = parseFloat(amount) * 100;

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/withdrawals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amountPaise, upiId }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to submit");

            toast.success("Withdrawal request submitted!");
            setAmount("");
            setUpiId("");
            mutateUser();
            mutateWithdrawals();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-white" /></div>;

    return (
        <div className="space-y-6">
            <div className="space-y-2 animate-fade-in">
                <h1 className="text-2xl font-bold text-white">Withdraw Funds 🏦</h1>
                <p className="text-slate-400 text-sm">Transfer your earnings to your bank account.</p>
            </div>

            {/* Balance */}
            <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl animate-scale-in">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Available Balance</p>
                        <h2 className="text-4xl font-black mt-1 tracking-tight">₹{(user.balancePaise / 100).toFixed(2)}</h2>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
                        <Wallet className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Form */}
            <Card className="glass-panel border-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <CardHeader>
                    <CardTitle className="text-lg text-white">Request Withdrawal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Amount (₹)</label>
                            <Input
                                type="number"
                                placeholder="Min ₹100"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="100"
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">UPI ID</label>
                            <Input
                                placeholder="username@upi"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                required
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                            />
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Request"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* History */}
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-400" /> Withdrawal History
                </h3>
                <div className="space-y-3">
                    {withdrawals?.length > 0 ? (
                        withdrawals.map((w: any) => (
                            <div key={w.id} className="glass-panel p-4 rounded-xl flex justify-between items-center hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="font-bold text-white">₹{(w.amountPaise / 100).toFixed(0)}</p>
                                    <p className="text-xs text-slate-400">{new Date(w.createdAt).toLocaleDateString()}</p>
                                </div>
                                <StatusBadge status={w.status} />
                            </div>
                        ))
                    ) : (
                        <div className="glass-panel p-8 text-center text-slate-500 text-sm rounded-xl">
                            No withdrawals yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        APPROVED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${styles[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
            {status}
        </span>
    );
}
