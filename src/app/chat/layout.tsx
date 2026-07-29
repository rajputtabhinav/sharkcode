import MobileContainer from "@/components/layout/MobileContainer";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MobileContainer>
            <div className="flex flex-col h-screen">
                {children}
            </div>
        </MobileContainer>
    );
}
