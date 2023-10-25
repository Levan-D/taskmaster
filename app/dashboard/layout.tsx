/** @format */

import Sidebar from "../components/Sidebar"
import UserInfo from "../components/UserInfo"
import LogoutBtn from "../components/LogoutBtn"
import WidgetDisplay from "../components/widgets/WidgetDisplay"
import TaskHeader from "../components/tasks/TaskHeader"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100dvh)]  ">
      <Sidebar LogoutBtn={<LogoutBtn />} UserInfo={<UserInfo />} />

      <div className="w-full   max-w-7xl mx-auto">
        <div className="mx-4 ">
          <TaskHeader />
          <div className="flex gap-4 relative   w-full mt-4">
            <div className="grow min-h-[calc(100dvh-140px)]  shrink-0   flex flex-col basis-2/3 overflow-auto max-w-3xl mx-auto ">
              <div className="   grow">{children}</div>
            </div>

            <WidgetDisplay className="sticky  h-[600px] top-4  w-full max-w-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
