import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AccountProvider } from "@/context/accountContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Lapisla.net",
  description:
    "Lapisla is a user-friendly theorem prover and ecosystem designed for everyone. Greetings! 👋",
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AccountProvider>{children}</AccountProvider>
      </body>
    </html>
  );
}
