/** @format */

import CreateTask from "@/app/components/tasks/taskComps/CreateTask"
import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { getTasks } from "../../actions"

export default async function Today() {
  const tasks = await getTasks({ isDeleted: false })

  if (!tasks.success) return <span></span>

  const totalTasks = tasks.data?.length ?? 0
  const tasksCompleted = tasks.data?.filter(task => task.isComplete).length ?? 0

  return (
    <section className="m-4">
      <div className="max-w-3xl mx-auto">
        <CreateTask totalTasks={totalTasks} />

        {tasks.data && (
          <Tasks
            tasks={tasks.data}
            totalTasks={totalTasks}
            tasksCompleted={tasksCompleted}
          />
        )}
      </div>
    </section>
  )
}
