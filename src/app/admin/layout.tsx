"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useSWR("/api/user", fetcher);
    const router = useRouter();

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    if (!user || user.role !== "ADMIN") {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link href="/admin" className="font-bold text-xl flex items-center gap-2">
                        <span className="text-2xl">🦈</span> SharkCode Admin
                    </Link>
                    <div className="space-x-4 text-sm">
                        <Link href="/admin/payments" className="hover:text-blue-300">Payments</Link>
                        <Link href="/admin/withdrawals" className="hover:text-blue-300">Withdrawals</Link>
                        <Link href="/admin/users" className="hover:text-blue-300">Users</Link>
                        <Link href="/admin/logs" className="hover:text-blue-300">Logs</Link>
                    </div>
                </div>
            </nav>
            <main className="max-w-4xl mx-auto p-4">
                {children}
            </main>
        </div>
    );
}
