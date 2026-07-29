import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-20 w-3/4 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

