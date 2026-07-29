"use client";

import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Loader2, Wallet } from "lucide-react";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminWithdrawalsPage() {
    const { data: withdrawals, mutate } = useSWR("/api/admin/withdrawals", fetcher);
    const [processing, setProcessing] = useState<string | null>(null);

    const handleAction = async (withdrawalId: string, status: "PAID" | "REJECTED") => {
        setProcessing(withdrawalId);
        try {
            await fetch("/api/admin/withdrawals", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ withdrawalId, status }),
            });
            mutate();
            toast.success(`Withdrawal ${status.toLowerCase()} successfully`);
        } catch (error) {
            toast.error("Failed to update withdrawal");
        } finally {
            setProcessing(null);
        }
    };

    if (!withdrawals) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Withdrawal Requests</h1>

            <div className="space-y-4">
                {withdrawals.map((withdrawal: any) => (
                    <Card key={withdrawal.id} className="overflow-hidden">
                        <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${withdrawal.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                                            withdrawal.status === "PAID" ? "bg-green-100 text-green-700" :
                                                "bg-red-100 text-red-700"
                                        }`}>
                                        {withdrawal.status}
                                    </span>
                                    <span className="text-slate-500 text-xs">
                                        {new Date(withdrawal.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="font-bold text-lg mt-1">₹{(withdrawal.amountPaise / 100).toFixed(0)}</p>
                                <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                                    <Wallet className="w-4 h-4" />
                                    <span className="font-mono font-medium">{withdrawal.upiId}</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">User: {withdrawal.user?.name} ({withdrawal.user?.email})</p>
                            </div>

                            {withdrawal.status === "PENDING" && (
                                <div className="flex space-x-2 w-full md:w-auto">
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 flex-1"
                                        onClick={() => handleAction(withdrawal.id, "PAID")}
                                        disabled={!!processing}
                                    >
                                        {processing === withdrawal.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                                        Mark Paid
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => handleAction(withdrawal.id, "REJECTED")}
                                        disabled={!!processing}
                                    >
                                        <X className="w-4 h-4 mr-1" /> Reject
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {withdrawals.length === 0 && <p className="text-center text-slate-500">No withdrawals found.</p>}
            </div>
        </div>
    );
}
