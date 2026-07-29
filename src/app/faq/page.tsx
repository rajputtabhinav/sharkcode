import Link from "next/link";
import { Button } from "@/components/ui/button";
import MobileContainer from "@/components/layout/MobileContainer";
import { ArrowLeft, ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "What is SharkCode?",
        answer: "SharkCode is a referral platform where you can earn money by inviting others to join. You earn ₹10 for every signup and ₹80 when they upgrade to Pro."
    },
    {
        question: "How do I get started?",
        answer: "Simply sign up for a free account to get your ₹50 bonus. Then upgrade to Pro for ₹100 to unlock the referral system and start earning."
    },
    {
        question: "How much can I earn?",
        answer: "You can earn ₹10 for each person who signs up using your referral link, plus ₹80 when they upgrade to Pro. There's no limit to how much you can earn!"
    },
    {
        question: "What is the minimum withdrawal amount?",
        answer: "The minimum withdrawal amount is ₹100. Withdrawals are processed within 24-48 hours to your UPI ID."
    },
    {
        question: "Why do I need to be Pro to refer?",
        answer: "The Pro membership helps maintain the quality of our community and ensures that active members benefit from the referral program. It's a one-time ₹100 investment."
    },
    {
        question: "How do I withdraw my earnings?",
        answer: "Go to the Withdraw page, enter the amount and your UPI ID. Your withdrawal will be processed within 24-48 hours once approved."
    },
    {
        question: "Is my payment secure?",
        answer: "Yes, all payments are processed through verified UPI channels. We verify every transaction manually for your security."
    },
    {
        question: "Can I have multiple accounts?",
        answer: "No, each user is allowed only one account. Creating multiple accounts will result in permanent ban and forfeiture of earnings."
    },
    {
        question: "How do I get my referral link?",
        answer: "After upgrading to Pro, go to the Refer page to find your unique referral link and QR code that you can share with others."
    },
    {
        question: "What happens if someone uses my referral link but doesn't upgrade?",
        answer: "You'll still earn ₹10 when they sign up. You'll earn an additional ₹80 if and when they decide to upgrade to Pro."
    }
];

export default function FAQPage() {
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
                        <h1 className="text-xl font-bold text-slate-900">FAQs</h1>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-slate-500 text-sm mb-6">
                        Find answers to commonly asked questions about SharkCode.
                    </p>

                    {faqs.map((faq, index) => (
                        <details
                            key={index}
                            className="group border border-slate-200 rounded-xl overflow-hidden"
                        >
                            <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                <span className="font-medium text-slate-900 text-sm pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="p-4 bg-white">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </details>
                    ))}

                    <div className="pt-6 space-y-4">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h3 className="font-semibold text-blue-900 mb-2">Still have questions?</h3>
                            <p className="text-sm text-blue-700 mb-3">
                                Can&apos;t find what you&apos;re looking for? Contact our support team.
                            </p>
                            <a href="mailto:support@sharkcode.com">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    Contact Support
                                </Button>
                            </a>
                        </div>

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

