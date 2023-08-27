/** @format */

import { getTasks } from "../../actions"
import Task from "./Task"

export default async function Tasks() {
  const tasks = await getTasks({ deleted: false })

  if (tasks.success)
    return (
      <div>
        {tasks.data.map(task => (
          <Task key={task.id} {...task} />
        ))}
      </div>
    )
}
