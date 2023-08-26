/** @format */

import { getTasks } from "../../actions"
import RecycleTask from "./RecycleTask"
import ToggleComplete from "./ToggleComplete"

export default async function Tasks() {
  const tasks = await getTasks({ deleted: false })

  if (tasks.success)
    return (
      <div>
        {tasks.data.map(task => (
          <div key={task.id}>
            <p>{task.title}</p>
            <RecycleTask taskId={task.id} />
            <ToggleComplete taskId={task.id} state={task.state} />
          </div>
        ))}
      </div>
    )
}
