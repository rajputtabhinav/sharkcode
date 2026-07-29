import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="text-5xl animate-pulse">
                    🦈
                </div>
                <p className="text-slate-500 text-sm font-medium">Loading...</p>
            </div>
        </div>
    );
}

