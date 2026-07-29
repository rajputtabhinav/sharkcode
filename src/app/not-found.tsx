import Link from "next/link";
import { Button } from "@/components/ui/button";
import MobileContainer from "@/components/layout/MobileContainer";
import { Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <MobileContainer>
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                <div className="relative mb-8">
                    <div className="text-[120px] font-black text-slate-100 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">🦈</span>
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Page Not Found
                </h1>
                <p className="text-slate-500 mb-8 max-w-xs">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                
                <div className="flex flex-col w-full max-w-xs gap-3">
                    <Link href="/dashboard">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            <Home className="w-4 h-4 mr-2" />
                            Go to Dashboard
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="w-full">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </MobileContainer>
    );
}

