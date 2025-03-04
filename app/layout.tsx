import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/utilties/providers";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getProfileByUserIdAction, createProfileAction } from "@/actions/profiles-actions";
import Header from "@/components/header";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Notes APP",
  description: "AI Notes APP",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  if (userId) {
    const profile = await getProfileByUserIdAction(userId);
    if (!profile.data) {
      await createProfileAction({userId});
    }
  }

  return (
    <ClerkProvider>
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
     
          <Providers
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Toaster />
          </Providers>
       
      </body>
    </html>
    </ClerkProvider>
  );
}
