import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import DashboardHeader from "../components/getstarted/DashboardHeader";
import Footer from "../components/landing/Footer";
import AppWalletProvider from "../components/AppWalletProvider";

const poppins = localFont({
  src: [
    {
      path: "./fonts/Poppins-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Poppins-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const ibmPlexMono = localFont({
  src: [
    {
      path: "./fonts/IBMPlexMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/IBMPlexMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const exo2 = localFont({
  src: [
    {
      path: "./fonts/Exo2-VariableFont_wght.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Exo2-VariableFont_wght.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-exo2",
  display: "swap",
});

const orbitron = localFont({
  src: [
    {
      path: "./fonts/Orbitron-VariableFont_wght.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Orbitron-VariableFont_wght.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-orbitron",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-VariableFont_wght.woff2",
  variable: "--font-space-grotesk",
  display: "swap",
});

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "ARK",
  description: "A decentralized protocol for onchain states",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${ibmPlexMono.variable} ${exo2.variable} ${spaceGrotesk.variable} ${orbitron.variable}`}
    >
      <body>
        <div>
          <main>
            <AppWalletProvider>
              <DashboardHeader />
              {children}
              <Footer />
            </AppWalletProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
