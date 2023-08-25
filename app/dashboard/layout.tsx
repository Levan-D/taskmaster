/** @format */

import React from "react"
import Sidebar from "./components/Sidebar"
import UserInfo from "./components/UserInfo"
import LogoutBtn from "./components/LogoutBtn"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar LogoutBtn={<LogoutBtn />} UserInfo={<UserInfo />} />

      <div className="">{children}</div>
    </div>
  )
}
