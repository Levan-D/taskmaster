/** @format */

import { getTodaysTasks } from "../../actions"
import TaskDisplay from "./TaskDisplay"

export default async function Today() {
  const tasks = await getTodaysTasks({ deleted: false })

  if (!tasks.success) return <span></span>

  return (
    <section className="  max-w-3xl mx-auto ">
      {tasks.data !== undefined && <TaskDisplay tasks={tasks.data} />}
    </section>
  )
}
