import { AccountProvider } from "@/context/accountContext";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  openGraph: {
    title: "Lapisla.net",
    description:
      "Lapisla is a user-friendly theorem prover and ecosystem designed for everyone. Greetings! 👋",
    type: "website",
    url: "https://lapisla.net",
    images: [
      {
        url: "https://lapisla.net/ogp.png",
        width: 1200,
        height: 630,
        alt: "Lapisla.net",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },

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
