"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminLogsPage() {
    // For now, we'll just show referral events as logs
    const { data: logs } = useSWR("/api/admin/logs", fetcher);

    if (!logs) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">System Logs</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Referral Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {logs.length > 0 ? (
                            logs.map((log: any) => (
                                <div key={log.id} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                {log.type === "SIGNUP" ? "New Referral Signup" : "Pro Upgrade Commission"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-900">₹{(log.amountPaise / 100).toFixed(0)}</p>
                                        <p className="text-xs text-slate-500">To: {log.referrer?.name}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 text-sm">No logs found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
