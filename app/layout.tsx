/** @format */

import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/lib/providers"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { HooksWrapper } from "./HooksWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Taskmaster",
  description: "Organize your tasks in orderly fashion",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
        </head>

        <body
          className={`${inter.className}  text-white bg-neutral-900 flex flex-col min-h-screen `}
        >
          <HooksWrapper>
            <main className="grow">
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
            </main>
          </HooksWrapper>
        </body>
      </html>
    </Providers>
  )
}
