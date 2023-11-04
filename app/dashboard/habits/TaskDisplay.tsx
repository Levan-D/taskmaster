/** @format */

"use client"

import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { useOptimistic } from "react"

type Props = {
  tasks: Task[]
}

const filterHabits = (tasks: Task[]) => {
  const filteredTasks = tasks
    .filter((task: Task) => {
      if (task.deleted) return false

      return task
    })
    .map((task: Task) => ({
      ...task,
      steps: task.steps.filter((step: Step) => !step.deleted),
    }))

  return filteredTasks
}

export default function TaskDisplay({ tasks }: Props) {
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state: Task[], updatedTasks: Task[]) => {
      if (updatedTasks.length === 0) return []

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

  const filteredHabits = filterHabits(optimisticTasks)
  const totalHabits = filteredHabits.length

  return (
    <div className={` pb-4  `}>
      {totalHabits === 0 ? (
        <div
          className={` ${
            totalHabits === 0 && "pt-[12vh]"
          } mt-0 transition-[padding]   duration-500 `}
        >
          <div className={`mb-28 text-center text-sm sm:text-base`}>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              You currently don&apos;t have any missed tasks
            </h2>
            <p className="text-neutral-300">Yay, you&apos;re on point</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <div className="grow">
            <Tasks
              addOptimisticTask={addOptimisticTask}
              className={"my-8"}
              tasks={filteredHabits}
            />
          </div>
        </div>
      )}
    </div>
  )
}
