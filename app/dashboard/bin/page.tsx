/** @format */

import { getCompletedTasks } from "../../actions"
import TaskDisplay from "./TaskDisplay"

export default async function Bin() {
  const tasks = await getCompletedTasks({ deleted: false, skip: 0 })

  if (!tasks.success) return <span></span>

  return (
    <section className="  max-w-3xl mx-auto ">
      {tasks.data !== undefined && <TaskDisplay tasks={tasks.data} />}
    </section>
  )
}