import MobileContainer from "@/components/layout/MobileContainer";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MobileContainer>
            {children}
        </MobileContainer>
    );
}
