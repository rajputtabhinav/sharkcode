import MobileContainer from "@/components/layout/MobileContainer";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MobileContainer>
            <DashboardHeader />
            <div className="pb-24 pt-4 px-4">
                {children}
            </div>
        </MobileContainer>
    );
}
