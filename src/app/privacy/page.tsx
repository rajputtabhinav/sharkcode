import Link from "next/link";
import { Button } from "@/components/ui/button";
import MobileContainer from "@/components/layout/MobileContainer";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
                        <h1 className="text-xl font-bold text-slate-900">Privacy Policy</h1>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 space-y-6 text-slate-600">
                    <p className="text-sm text-slate-500">Last updated: December 2024</p>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
                        <p className="text-sm leading-relaxed">
                            We collect information you provide directly to us when you create an account, 
                            make a payment, or communicate with us:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                            <li>Name and email address</li>
                            <li>UPI ID for payments</li>
                            <li>Referral activity and earnings</li>
                            <li>Device and usage information</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">2. How We Use Your Information</h2>
                        <p className="text-sm leading-relaxed">We use the information we collect to:</p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                            <li>Provide and maintain our services</li>
                            <li>Process payments and withdrawals</li>
                            <li>Track and reward referrals</li>
                            <li>Send you updates and marketing communications</li>
                            <li>Prevent fraud and abuse</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">3. Information Sharing</h2>
                        <p className="text-sm leading-relaxed">
                            We do not sell, trade, or rent your personal information to third parties. 
                            We may share information with:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                            <li>Payment processors for transaction processing</li>
                            <li>Service providers who assist in our operations</li>
                            <li>Law enforcement when required by law</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">4. Data Security</h2>
                        <p className="text-sm leading-relaxed">
                            We implement appropriate security measures to protect your personal information. 
                            However, no method of transmission over the Internet is 100% secure, and we 
                            cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">5. Cookies</h2>
                        <p className="text-sm leading-relaxed">
                            We use cookies and similar technologies to enhance your experience, 
                            analyze usage patterns, and personalize content.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">6. Your Rights</h2>
                        <p className="text-sm leading-relaxed">You have the right to:</p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your account</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900">7. Contact Us</h2>
                        <p className="text-sm leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at 
                            privacy@sharkcode.com
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

