"use client";

import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminUsersPage() {
    const { data: users } = useSWR("/api/admin/users", fetcher);

    if (!users) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Users</h1>

            <div className="space-y-4">
                {users.map((user: any) => (
                    <Card key={user.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-slate-100 p-2 rounded-full">
                                    <User className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{user.name}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                    <p className="text-xs text-slate-400 mt-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                {user.isPro && (
                                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200 block mb-1">
                                        PRO
                                    </span>
                                )}
                                <p className="font-bold text-slate-900">₹{(user.balancePaise / 100).toFixed(0)}</p>
                                <p className="text-xs text-slate-500">Earned: ₹{(user.totalEarnedPaise / 100).toFixed(0)}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
