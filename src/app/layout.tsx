import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Import test utilities in development
if (process.env.NODE_ENV === 'development') {
  import('@/utils/test-toast-system');
}


const geistSans = Geist({

  variable: "--font-geist-sans",

  subsets: ["latin"],

});

const geistMono = Geist_Mono({

  variable: "--font-geist-mono",

  subsets: ["latin"],

});

export const metadata: Metadata = {

  title: "BruteForce",

  description: "BruteForce Executive Portal",

};

export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full overflow-y-auto custom-scrollbar flex flex-col ">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QueryProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </QueryProvider>
        </ThemeProvider>
        <Toaster position="top-center" theme="dark" richColors closeButton />
      </body>
    </html>
  );

}
