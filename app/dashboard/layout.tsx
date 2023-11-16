/** @format */

import Sidebar from "../components/Sidebar"
import UserInfo from "../components/UserInfo"
import LogoutBtn from "../components/LogoutBtn"
import WidgetDisplay from "../components/widgets/WidgetDisplay"
import TaskHeader from "../components/tasks/TaskHeader"

export const dynamic = "force-dynamic"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100dvh)]   ">
      <Sidebar LogoutBtn={<LogoutBtn />} UserInfo={<UserInfo />} />

      <div className="w-full    max-w-7xl mx-auto">
        <div className="mx-4 ">
          <TaskHeader />
          <div className="flex gap-4 relative  w-full mt-4">
            <div className="grow min-h-[calc(100dvh-140px)]  shrink-0   flex flex-col basis-2/3  max-w-3xl mx-auto ">
              <div className=" mb-24 lg:mb-0  grow">{children}</div>
            </div>
            <WidgetDisplay className="hidden lg:block sticky h-fit   max-h-[500px] top-4  w-full max-w-xl" />
          </div>
          <WidgetDisplay className="fixed visible rounded-b-none lg:collapse  shadow-[0px_-8px_8px_-1px_rgba(20,20,20,1)] bottom-0 right-4 h-[100px] w-[calc(100%-32px)] sm:w-[calc(100%-88px)] " />
        </div>
      </div>
    </div>
  )
}
