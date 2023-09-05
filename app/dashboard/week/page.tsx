/** @format */

import { getFutureTasks } from "../../actions"
import TaskDisplay from "./TaskDisplay"

export default async function Week() {
  const tasks = await getFutureTasks({ deleted: false })

  if (!tasks.success) return <span></span>

  return (
    <section className="  max-w-3xl mx-auto ">
      {tasks.data !== undefined && <TaskDisplay tasks={tasks.data} />}
    </section>
  )
}
