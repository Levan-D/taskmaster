/** @format */

import Sidebar from "../components/Sidebar"
import UserInfo from "../components/UserInfo"
import LogoutBtn from "../components/LogoutBtn"

import { checkUserExists } from "../actions/userActions"
import GlobalSideEffects from "../components/GlobalSideEffects"

export default function Layout({ children }: { children: React.ReactNode }) {
  // await checkUserExists() <--  fix this

  return (
    <div className="flex ">
      <GlobalSideEffects />
      <Sidebar LogoutBtn={<LogoutBtn />} UserInfo={<UserInfo />} />

      <div className="grow mx-4 sm:pt-0 pt-12 min-h-screen">{children}</div>
    </div>
  )
}
