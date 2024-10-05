import DashboardHeader from "@/components/getstarted/DashboardHeader";
import AppWalletProvider from "@/components/AppWalletProvider";

export default function NewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>
        <AppWalletProvider>
          <DashboardHeader />
          {children}
        </AppWalletProvider>
      </main>
    </div>
  );
}
