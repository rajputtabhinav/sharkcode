"use client";

// import { SignUp } from "@clerk/nextjs"; // Removed - will add another auth service later
import { useSearchParams } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";
import { Suspense } from "react";
import Link from "next/link";

function SignUpForm() {
    const searchParams = useSearchParams();
    const referralCode = searchParams.get("ref");

    return (
        <div className="max-w-md w-full space-y-6 text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            {referralCode && (
                <p className="text-sm text-green-600">
                    Referral code detected: <span className="font-mono font-bold">{referralCode}</span>
                </p>
            )}
            <p className="text-gray-600">Authentication temporarily disabled</p>
            <p className="text-sm text-gray-500">We&apos;re setting up a new authentication service. Please check back soon!</p>
            <Link 
                href="/" 
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Back to Home
            </Link>
        </div>
    );
}

export default function SignUpPage() {
    return (
        <MobileContainer>
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
                <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
                    <SignUpForm />
                </Suspense>
            </div>
        </MobileContainer>
    );
}
