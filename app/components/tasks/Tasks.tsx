/** @format */

import { getTasks } from "../../actions"
import Task from "./Task"

export default async function Tasks() {
  const tasks = await getTasks({ deleted: false })

  if (tasks.success && tasks.data)
    return (
      <div className="flex flex-col gap-4">
        {tasks.data.map(task => (
          <Task key={task.id} {...task} />
        ))}
      </div>
    )
}
