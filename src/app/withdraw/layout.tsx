import MobileContainer from "@/components/layout/MobileContainer";

export default function WithdrawLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MobileContainer>
            <div className="p-4">
                {children}
            </div>
        </MobileContainer>
    );
}
