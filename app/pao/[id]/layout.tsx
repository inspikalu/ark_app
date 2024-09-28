import DashboardHeader from "@/components/getstarted/DashboardHeader";
import Footer from "@/components/landing/Footer";
import AppWalletProvider from "@/components/AppWalletProvider";

export default function NewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>
        <AppWalletProvider>
          <DashboardHeader />
          {children}
          <Footer />
        </AppWalletProvider>
      </main>
    </div>
  );
}
