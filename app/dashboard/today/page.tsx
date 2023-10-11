/** @format */

import { getTodaysTasks } from "../../actions/taskActions"
import TaskDisplay from "./TaskDisplay"
import { cookies } from "next/headers"
import Loader from "@/app/components/Loader"

export default async function Today() {
  if (cookies().get("user_time")?.value === undefined) return <Loader />

  const tasks = await getTodaysTasks()
  if (!tasks.success) return <span></span>
  return (
    <section className="  max-w-3xl mx-auto    ">
      {tasks.data !== undefined && <TaskDisplay tasks={tasks.data} />}
    </section>
  )
}
