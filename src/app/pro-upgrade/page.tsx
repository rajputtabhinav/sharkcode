"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Copy, Loader2, ShieldCheck } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProUpgradePage() {
    const router = useRouter();
    const { data: user, mutate } = useSWR("/api/user", fetcher);
    const { data: payments } = useSWR("/api/payments", fetcher);

    const [upiRef, setUpiRef] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("sharkcode@upi");
        toast.success("UPI ID copied to clipboard!");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!upiRef) return;

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amountPaise: 10000, // ₹100
                    upiRef,
                }),
            });

            if (!res.ok) throw new Error("Failed to submit");

            toast.success("Payment submitted for approval!");
            setUpiRef("");
            mutate(); // Refresh user/payments
        } catch (error) {
            toast.error("Something went wrong. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    if (user.isPro) {
        return (
            <div className="p-6 text-center space-y-4">
                <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">You are a Pro Member!</h2>
                <p className="text-slate-500">Enjoy unlimited earning potential.</p>
                <Button onClick={() => router.push("/dashboard")} className="w-full">Go to Dashboard</Button>
            </div>
        );
    }

    const pendingPayment = payments?.find((p: any) => p.status === "PENDING");

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">Upgrade to Pro ⭐</h1>
                <p className="text-slate-500 text-sm">Unlock referral earnings for just ₹100.</p>
            </div>

            {/* Benefits */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="text-green-400 w-5 h-5" />
                        <span>Earn ₹10 per referral signup</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="text-green-400 w-5 h-5" />
                        <span>Earn ₹80 per Pro upgrade</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="text-green-400 w-5 h-5" />
                        <span>Instant Withdrawals</span>
                    </div>
                </CardContent>
            </Card>

            {pendingPayment ? (
                <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-6 text-center">
                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-2" />
                        <h3 className="font-bold text-amber-800">Payment Verification Pending</h3>
                        <p className="text-sm text-amber-600 mt-1">
                            We are verifying your payment of ₹100 (Ref: {pendingPayment.upiRef}).<br />
                            This usually takes 1-2 hours.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Step 1: Pay ₹100</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200">
                            <div>
                                <p className="text-xs text-slate-500">UPI ID</p>
                                <p className="font-mono font-medium text-slate-900">sharkcode@upi</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleCopy}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500">
                            Open any UPI app (GPay, PhonePe, Paytm) and pay ₹100 to the above UPI ID.
                        </p>
                    </CardContent>
                </Card>
            )}

            {!pendingPayment && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Step 2: Submit Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">UTR / Reference Number</label>
                                <Input
                                    placeholder="e.g. 3245xxxxxxxx"
                                    value={upiRef}
                                    onChange={(e) => setUpiRef(e.target.value)}
                                    required
                                    minLength={12}
                                />
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                                Submit for Verification
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
