/** @format */

import React from "react"
import { redirect } from "next/navigation"

export default function Dashboard() {
  redirect("/dashboard/today")
  return <div>page</div>
}
