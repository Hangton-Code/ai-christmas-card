import type { Metadata } from "next";
import { Noto_Sans_HK } from "next/font/google";
import "./globals.css";
import { Provider } from "@/lib/provider";
import { Toaster } from "@/components/ui/toaster";

const notonSansHk = Noto_Sans_HK({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hangton Christmas Card",
  description: "朋友，歡迎來查收你的聖誕咭",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <html lang="en">
        <body className={notonSansHk.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </Provider>
  );
}
