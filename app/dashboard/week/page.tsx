/** @format */

import { getWeeksTasks } from "../../actions/taskActions"
import TaskDisplay from "./TaskDisplay"
import { cookies } from "next/headers"
import Loader from "@/app/components/Loader"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Week",
}

export default async function Week() {
  if (cookies().get("user_time")?.value === undefined) return <Loader />

  const tasks = await getWeeksTasks()

  if (!tasks.success) return <span></span>

  return (
    <section className="  max-w-3xl mx-auto ">
      {tasks.data !== undefined && <TaskDisplay tasks={tasks.data} />}
    </section>
  )
}
