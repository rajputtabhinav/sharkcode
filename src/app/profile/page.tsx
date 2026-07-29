"use client";

// import { useClerk } from "@clerk/nextjs"; // Removed - auth temporarily disabled
import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    Loader2, LogOut, Mail, User, HelpCircle, FileText, Shield, ChevronRight,
    Wallet, Users, Crown, History, MessageSquare, ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProfilePage() {
    const router = useRouter();
    // const { signOut } = useClerk(); // Removed - auth temporarily disabled
    const { data: user, isLoading, error } = useSWR("/api/user", fetcher);

    if (isLoading || !user) {
        return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-slate-600" /></div>;
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-400">
                Failed to load profile. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            {/* Header with back button */}
            <div className="flex items-center gap-3">
                <Link href="/chat">
                    <Button size="icon" variant="ghost" className="shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-slate-900">Profile</h1>
            </div>

            {/* User Info */}
            <div className="flex flex-col items-center space-y-4 animate-fade-in">
                <Avatar className="w-20 h-20 border-4 border-slate-100 shadow-lg">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                        {user.name?.[0] || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900">{user.name || "User"}</h2>
                    <p className="text-slate-500 text-sm">{user.email}</p>
                </div>
                {user.isPro && (
                    <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-bold border border-amber-200">
                        Pro Member ⭐
                    </span>
                )}
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
                <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Available Balance</p>
                <h3 className="text-3xl font-black mt-1">₹{(user.balancePaise / 100).toFixed(2)}</h3>
                <div className="flex gap-2 mt-4">
                    <p className="text-xs text-blue-200">
                        Total Earned: ₹{(user.totalEarnedPaise / 100).toFixed(0)}
                    </p>
                    <span className="text-blue-300">•</span>
                    <p className="text-xs text-blue-200">
                        Referrals: {user.totalReferrals}
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase px-1">Quick Actions</h3>
                <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-sm">
                    <Link href="/chat" className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-xl">
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <span className="font-medium text-slate-900">SharkAI Chat</span>
                                <p className="text-xs text-slate-500">AI Assistant</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    {user.isPro ? (
                        <Link href="/refer" className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="bg-emerald-100 p-2 rounded-xl">
                                    <Users className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <span className="font-medium text-slate-900">Refer & Earn</span>
                                    <p className="text-xs text-slate-500">₹10 + ₹80 per referral</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </Link>
                    ) : (
                        <Link href="/pro-upgrade" className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="bg-amber-100 p-2 rounded-xl">
                                    <Crown className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <span className="font-medium text-slate-900">Upgrade to Pro</span>
                                    <p className="text-xs text-slate-500">Unlock referral earnings</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </Link>
                    )}

                    <Link href="/withdraw" className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 p-2 rounded-xl">
                                <Wallet className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <span className="font-medium text-slate-900">Withdraw Funds</span>
                                <p className="text-xs text-slate-500">Min ₹100 via UPI</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    <Link href="/history" className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="bg-slate-100 p-2 rounded-xl">
                                <History className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <span className="font-medium text-slate-900">Transaction History</span>
                                <p className="text-xs text-slate-500">View all transactions</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                </div>
            </div>

            {/* Account Info */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase px-1">Account</h3>
                <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-sm">
                    <div className="p-4 flex items-center space-x-3">
                        <User className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500">Member Since</p>
                            <p className="text-sm font-medium text-slate-900">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="p-4 flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500">Email</p>
                            <p className="text-sm font-medium text-slate-900">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Help & Support */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase px-1">Help & Support</h3>
                <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-sm">
                    <Link href="/faq" className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <HelpCircle className="w-5 h-5 text-blue-500" />
                            <span className="font-medium text-slate-900">FAQs</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                    <Link href="/terms" className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-emerald-500" />
                            <span className="font-medium text-slate-900">Terms of Service</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                    <Link href="/privacy" className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <Shield className="w-5 h-5 text-purple-500" />
                            <span className="font-medium text-slate-900">Privacy Policy</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                </div>
            </div>

            {/* Sign Out (disabled - auth removed) */}
            <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                    // signOut({ redirectUrl: "/chat" }); // Auth disabled
                    router.push("/");
                }}
                disabled
            >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out (Disabled)
            </Button>

            <p className="text-center text-xs text-slate-400 pb-4">
                SharkCode v1.0.0
            </p>
        </div>
    );
}
