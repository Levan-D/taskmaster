/** @format */

import Sidebar from "../components/Sidebar"
import UserInfo from "../components/UserInfo"
import LogoutBtn from "../components/LogoutBtn"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex ">
      <Sidebar LogoutBtn={<LogoutBtn />} UserInfo={<UserInfo />} />

      <div className="grow mx-4 sm:pt-0 pt-12 min-h-screen">{children}</div>
    </div>
  )
}
