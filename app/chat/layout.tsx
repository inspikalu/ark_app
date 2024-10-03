import React from "react";
import AppWalletProvider from "@/components/AppWalletProvider";

const NewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="h-full">
        <AppWalletProvider>{children}</AppWalletProvider>
      </main>
    </div>
  );
};

export default NewLayout;