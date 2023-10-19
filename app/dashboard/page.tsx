/** @format */

import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function Dashboard() {
  redirect("/dashboard/today")
}
