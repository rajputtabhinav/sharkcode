import React from "react";

export default function MobileContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex justify-center">
            <div className="w-full max-w-[420px] bg-white min-h-screen shadow-xl relative pb-20">
                {children}
            </div>
        </div>
    );
}
