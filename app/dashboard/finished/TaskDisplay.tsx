/** @format */

"use client"

import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { experimental_useOptimistic as useOptimistic } from "react"
import TasksRecycle from "@/app/components/tasks/taskComps/TasksRecycle"

type Props = {
  tasks: Task[]
}

export default function TaskDisplay({ tasks }: Props) {
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state: Task[], updatedTasks: Task[]) => {
      const oldTasks = [...state]

      updatedTasks.forEach(updatedTask => {
        const taskIndex = oldTasks.findIndex(task => task.id === updatedTask.id)

        if (taskIndex !== -1) {
          oldTasks[taskIndex] = updatedTask
        } else if (updatedTask.id === "optimistic") {
          oldTasks.unshift(updatedTask)
        }
      })

      return oldTasks
    }
  )

  const completedTasks = optimisticTasks
    .map((task: Task) => ({
      ...task,
      steps: task.steps.filter((step: Step) => !step.deleted),
    }))
    .filter(task => task.complete)

  const completedTasksLength = completedTasks.length

  if (completedTasksLength === 0)
    return (
      <div className={`  mt-[30vh] text-center`}>
        <h2 className="text-2xl font-semibold mb-2">
          You don&apos;t have any completed tasks
        </h2>
        <p className="text-neutral-300">
          Go to to today, week, or habbit section to get started
        </p>
        <br />
      </div>
    )

  return (
    <div className={` py-4 `}>
      <>
        <div className="mainContainer bg-neutral-700 my-4 flex justify-between items-center   py-2 px-4">
          <p className="basis-3/4 text-neutral-200">Recycle completed tasks.</p>

          <TasksRecycle
            addOptimisticTask={addOptimisticTask}
            tasks={completedTasks}
            className="shrink-0"
          />
        </div>

        <Tasks
          addOptimisticTask={addOptimisticTask}
          className={"my-8"}
          tasks={completedTasks}
        />
      </>
    </div>
  )
}
