import Link from "next/link";
import { Button } from "@/components/ui/button";
import MobileContainer from "@/components/layout/MobileContainer";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <MobileContainer>
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="shrink-0">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-900">Terms of Service</h1>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 space-y-6 text-slate-600">
                    <p className="text-sm text-slate-500">Last updated: December 2024</p>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
                        <p className="text-sm leading-relaxed">
                            By accessing and using SharkCode, you agree to be bound by these Terms of Service 
                            and all applicable laws and regulations. If you do not agree with any of these terms, 
                            you are prohibited from using this service.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">2. User Accounts</h2>
                        <p className="text-sm leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account and password. 
                            You agree to accept responsibility for all activities that occur under your account.
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                            <li>You must be at least 18 years old to use this service</li>
                            <li>You must provide accurate information during registration</li>
                            <li>One account per person is allowed</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">3. Referral Program</h2>
                        <p className="text-sm leading-relaxed">
                            Our referral program rewards users for bringing new members to SharkCode. 
                            The following rules apply:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                            <li>Only Pro members can participate in the referral program</li>
                            <li>Referral bonuses are credited within 24 hours of verification</li>
                            <li>Self-referrals and fake accounts will result in account termination</li>
                            <li>We reserve the right to modify referral amounts at any time</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">4. Payments & Withdrawals</h2>
                        <p className="text-sm leading-relaxed">
                            All payments are processed through UPI. Withdrawal requests are processed 
                            within 24-48 hours. Minimum withdrawal amount is ₹100.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">5. Prohibited Activities</h2>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                            <li>Creating multiple accounts</li>
                            <li>Using automated systems to generate referrals</li>
                            <li>Sharing misleading information about the service</li>
                            <li>Any form of fraud or abuse</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">6. Termination</h2>
                        <p className="text-sm leading-relaxed">
                            We reserve the right to terminate or suspend your account at any time for 
                            violations of these terms or suspicious activity.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">7. Contact</h2>
                        <p className="text-sm leading-relaxed">
                            If you have any questions about these Terms, please contact us at 
                            support@sharkcode.com
                        </p>
                    </section>

                    <div className="pt-6 border-t border-slate-100">
                        <Link href="/">
                            <Button variant="outline" className="w-full">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </MobileContainer>
    );
}

