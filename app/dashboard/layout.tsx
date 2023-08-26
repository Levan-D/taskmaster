/** @format */

import React from "react"
import Sidebar from "../components/Sidebar"
import UserInfo from "../components/UserInfo"
import LogoutBtn from "../components/LogoutBtn"
import { checkUserExists } from "../actions"

export default async function layout({ children }: { children: React.ReactNode }) {
  await checkUserExists()

  return (
    <div className="flex min-h-screen">
      <Sidebar LogoutBtn={<LogoutBtn />} UserInfo={<UserInfo />} />

      <div className="grow">{children}</div>
    </div>
  )
}
