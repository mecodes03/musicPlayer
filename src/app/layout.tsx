import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { PlayerStateProvider } from "@/components/contexts/PlayerStateContext";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import SideBar from "@/components/SideBar";
import { Toaster } from "sonner";
import { ScrollBorderContextProvider } from "@/components/Scroll";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <script
        defer
        data-domain="playmyplaylist.vercel.app"
        src="https://plausible.io/js/script.revenue.js"
      ></script>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <PlayerStateProvider>
              <ScrollBorderContextProvider>
                <Toaster />
                <div className="flex min-h-screen flex-col font-sans antialiased">
                  <div className="fixed top-0 z-30 h-16 w-full">
                    <Navbar />
                  </div>
                  <div className="fixed bottom-0 z-30 w-full">
                    <AudioPlayer />
                  </div>
                  <div className="fixed left-0 top-0 z-10 hidden h-full w-[4.5rem] sm:block">
                    <SideBar />
                  </div>
                  <main className="mt-16 flex flex-1 bg-neutral-950 pb-20">
                    <div className="h-full w-[calc(100%-4.5rem)] flex-1 sm:ml-[4.5rem]">
                      {children}
                    </div>
                  </main>
                </div>
              </ScrollBorderContextProvider>
            </PlayerStateProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
