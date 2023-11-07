/** @format */

import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/lib/providers"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { HooksWrapper } from "./HooksWrapper"
import Modal from "./components/modal/Modal"
import { Viewport } from "next"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    template: "%s | Taskmaster",
    default: "Taskmaster",
  },
  description: "One-stop shop for organizing your routine.",

  generator: "Next.js",
  applicationName: "Taskmaster",
  keywords: ["Taskmaster", "to do", "to-do", "routine", "organize"],
  authors: [{ name: "Lev" }],

  creator: "Levan Dolidze",
  publisher: "Levan Dolidze",

  metadataBase: new URL("https://taskmaster-flame.vercel.app"),

  openGraph: {
    title: "Taskmaster",
    description: "One-stop shop for organizing your routine.",
    url: "https://taskmaster-flame.vercel.app",
    siteName: "Taskmaster",
    images: [
      {
        url: "https://i.imgur.com/9ZHlWwd.png",
        width: 1200,
        height: 630,
        alt: "Main OGT",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  icons: {
    icon: "./public/icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body
          className={`${inter.className}  text-white bg-neutral-900 flex flex-col min-h-screen overscroll-contain sm:overscroll-auto	`}
        >
          <HooksWrapper>
            <main className="grow min-h-screen">
              {children}
              <ToastContainer
                position="top-right"
                autoClose={5000}
                limit={3}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="colored"
              />
          
              <div id="modal-root"></div>
            </main>
          </HooksWrapper>
        </body>
      </html>
    </Providers>
  )
}
