/** @format */

import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Taskmaster",
  description: "Organize your tasks in orderly fashion",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}  text-white bg-neutral-900 flex flex-col min-h-screen `}
      >
        <main className="grow">{children}</main>
      </body>
    </html>
  )
}
