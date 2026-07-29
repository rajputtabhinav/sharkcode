"use client";

import { useState } from "react";
import useSWR from "swr";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Lock, Share2, Users, Loader2 } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReferPage() {
    const { data: user, error, isLoading } = useSWR("/api/user", fetcher);
    if (isLoading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;
    if (error || !user) return <div className="p-10 text-center text-red-500">Failed to load user data. Please try refreshing.</div>;

    if (!user.isPro) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 p-6">
                <div className="bg-slate-100 p-6 rounded-full">
                    <Lock className="w-12 h-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Referrals Locked</h2>
                <p className="text-slate-500 max-w-xs">
                    You must be a Pro member to access the referral system and earn rewards.
                </p>
                <Link href="/pro-upgrade" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Unlock Now</Button>
                </Link>
            </div>
        );
    }

    const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/sign-up?ref=${user.referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success("Referral link copied!");
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Join Sharkcode",
                    text: "Join Sharkcode and earn rewards! Use my referral code.",
                    url: referralLink,
                });
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">Refer & Earn 💸</h1>
                <p className="text-slate-500 text-sm">Share your link and earn ₹10 per signup + ₹80 per upgrade.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs text-blue-600 font-medium uppercase">Total Referrals</p>
                        <p className="text-2xl font-bold text-blue-900">{user.totalReferrals}</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs text-green-600 font-medium uppercase">Pro Conversions</p>
                        <p className="text-2xl font-bold text-green-900">{user.totalProReferrals}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Code & Link */}
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-slate-500">Your Referral Code</p>
                        <div className="bg-slate-100 py-3 rounded-lg border border-dashed border-slate-300">
                            <p className="text-3xl font-mono font-bold text-slate-900 tracking-widest">{user.referralCode}</p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                            <QRCodeSVG value={referralLink} size={180} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={handleCopy} className="w-full">
                            <Copy className="w-4 h-4 mr-2" /> Copy Link
                        </Button>
                        <Button onClick={handleShare} className="w-full bg-blue-600 hover:bg-blue-700">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
