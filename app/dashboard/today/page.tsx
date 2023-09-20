/** @format */

import { getTodaysTasks } from "../../actions/taskActions"
import TaskDisplay from "./TaskDisplay"
import { DateTime } from "luxon"
import { cookies } from "next/headers"
import Loader from "@/app/components/Loader"

export default async function Today() {
  if (cookies().get("user_time")?.value === undefined) return <Loader />

  const tasks = await getTodaysTasks()
  tasks
  if (!tasks.success) return <span></span>
  const today = DateTime.now()

  const todayISO = today.toFormat("yyyy-MM-dd HH:mm:ss") || ""

  return (
    <section className="  max-w-3xl mx-auto w-full  ">
      {tasks.data !== undefined && <TaskDisplay tasks={tasks.data} todayISO={todayISO} />}
    </section>
  )
}
