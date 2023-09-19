/** @format */

import React from "react"
import Sidebar from "../components/Sidebar"
import UserInfo from "../components/UserInfo"
import LogoutBtn from "../components/LogoutBtn"
import { checkUserExists } from "../actions/userActions"

export default async function layout({ children }: { children: React.ReactNode }) {
  // await checkUserExists() <--  fix this

  return (
    <div className="flex ">
      <Sidebar LogoutBtn={<LogoutBtn />} UserInfo={<UserInfo />} />

      <div className="grow mx-4 sm:mt-0 mt-16 ">{children}</div>
    </div>
  )
}
