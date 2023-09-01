/** @format */

import { getTasks } from "../../actions"
import TaskDisplay from "./components/TaskDisplay"

export default async function Today() {
  const tasks = await getTasks({ deleted: false })

  if (!tasks.success) return <span></span>

  return (
    <section className="m-4 max-w-3xl mx-auto">
      {tasks.data !== undefined && <TaskDisplay tasks={tasks.data} />}
    </section>
  )
}
