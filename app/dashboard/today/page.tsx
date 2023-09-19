/** @format */

import { getTodaysTasks } from "../../actions/taskActions"
import TaskDisplay from "./TaskDisplay"

export default async function Today() {
  const tasks = await getTodaysTasks()

  if (!tasks.success) return <span></span>

  return (
    <section className="  max-w-3xl mx-auto w-full  ">
      {tasks.data !== undefined && <TaskDisplay tasks={tasks.data} />}
    </section>
  )
}
