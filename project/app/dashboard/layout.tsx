import { NavigationMenu } from "@/components/navigation-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      {children}
    </div>
  );
}