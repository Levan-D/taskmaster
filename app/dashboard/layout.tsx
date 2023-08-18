/** @format */

import React from "react"
import Sidebar from "../components/Sidebar"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div>{children}</div>
    </div>
  )
}
