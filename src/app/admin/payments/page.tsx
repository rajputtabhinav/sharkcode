"use client";

import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Loader2 } from "lucide-react";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminPaymentsPage() {
    const { data: payments, mutate } = useSWR("/api/admin/payments", fetcher);
    const [processing, setProcessing] = useState<string | null>(null);

    const handleAction = async (paymentId: string, status: "CONFIRMED" | "REJECTED") => {
        setProcessing(paymentId);
        try {
            await fetch("/api/admin/payments", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, status }),
            });
            mutate();
            toast.success(`Payment ${status.toLowerCase()} successfully`);
        } catch (error) {
            toast.error("Failed to update payment");
        } finally {
            setProcessing(null);
        }
    };

    if (!payments) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Payment Requests</h1>

            <div className="space-y-4">
                {payments.map((payment: any) => (
                    <Card key={payment.id} className="overflow-hidden">
                        <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${payment.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                                            payment.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                                                "bg-red-100 text-red-700"
                                        }`}>
                                        {payment.status}
                                    </span>
                                    <span className="text-slate-500 text-xs">
                                        {new Date(payment.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="font-bold text-lg mt-1">₹{(payment.amountPaise / 100).toFixed(0)}</p>
                                <p className="text-sm text-slate-600">Ref: <span className="font-mono font-medium">{payment.upiRef}</span></p>
                                <p className="text-sm text-slate-500">User: {payment.user?.name} ({payment.user?.email})</p>
                            </div>

                            {payment.status === "PENDING" && (
                                <div className="flex space-x-2 w-full md:w-auto">
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 flex-1"
                                        onClick={() => handleAction(payment.id, "CONFIRMED")}
                                        disabled={!!processing}
                                    >
                                        {processing === payment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => handleAction(payment.id, "REJECTED")}
                                        disabled={!!processing}
                                    >
                                        <X className="w-4 h-4 mr-1" /> Reject
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {payments.length === 0 && <p className="text-center text-slate-500">No payments found.</p>}
            </div>
        </div>
    );
}
