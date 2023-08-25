/** @format */

import React from "react"
import Sidebar from "../components/Sidebar"
import UserInfo from "../components/UserInfo"
import LogoutBtn from "../components/LogoutBtn"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { checkUserExits } from "../actions"

export default async function layout({ children }: { children: React.ReactNode }) {
  const { getUser } = getKindeServerSession()
  const user = getUser()

  const userData = await checkUserExits(user)

  return (
    <div className="flex min-h-screen">
      <Sidebar
        LogoutBtn={<LogoutBtn />}
        UserInfo={<UserInfo />}
        userId={userData?.loginId || null}
      />

      <div className="grow">{children}</div>
    </div>
  )
}
