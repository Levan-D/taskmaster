/** @format */

import { getTodaysTasks } from "../../actions/taskActions"
import TaskDisplay from "./TaskDisplay"
import { DateTime } from "luxon"

export default async function Today() {
  const tasks = await getTodaysTasks()

  if (!tasks.success) return <span></span>
  const today = DateTime.now().startOf("day")

  const todayISO = today.toISO() || ""

  return (
    <section className="  max-w-3xl mx-auto w-full  ">
      {tasks.data !== undefined && <TaskDisplay tasks={tasks.data} todayISO />}
    </section>
  )
}
