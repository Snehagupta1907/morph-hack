"use client";
import "./globals.css";

import DataContextProvider from "@/context/DataContext";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/utils/wallet-utils";
import { ChainProvider } from "@/context/ChainContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useParams, useRouter, usePathname } from "next/navigation";
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" reverseOrder={false} />
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              theme={darkTheme({
                accentColor: "#3C51D9",
                accentColorForeground: "white",
                borderRadius: "medium",
                fontStack: "system",
                overlayBlur: "small",
              })}
            >
              <ChainProvider>
                {pathname === "/launch" ? null : <Header />}
                <DataContextProvider>{children}</DataContextProvider>
              </ChainProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
