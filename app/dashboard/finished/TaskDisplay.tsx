/** @format */

"use client"

import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { experimental_useOptimistic as useOptimistic } from "react"
import RecycleAllCompletedTasks from "./RecycleAllCompletedTasks"
import Pagination from "@/app/components/Pagination"

type Props = {
  tasks: Task[]
  pageCount: number
  currentPage: number
}

const filterCompletedTasks = (tasks: Task[]) => {
  const filteredTasks = tasks
    .filter((task: Task) => {
      if (task.deleted) return false
      if (!task.due_date) return false

      return task
    })
    .map((task: Task) => ({
      ...task,
      steps: task.steps.filter((step: Step) => !step.deleted),
    }))

  return filteredTasks
}

export default function TaskDisplay({ tasks, pageCount, currentPage }: Props) {
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

  const filteredCompletedTasks = filterCompletedTasks(optimisticTasks)
  const totalCompletedTasks = filteredCompletedTasks.length

  return (
    <div className={` py-4 `}>
      {totalCompletedTasks === 0 ? (
        <div
          className={` ${
            totalCompletedTasks === 0 && "pt-[20vh]"
          } mt-0 transition-[padding]   duration-500 `}
        >
          <div className={`mb-28 text-center`}>
            <h2 className="text-2xl font-semibold mb-2">
              You currently don&apos;t have any finished tasks
            </h2>
            <p className="text-neutral-300">
              Navigate to today ,week , or habbit section to get started
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mainContainer bg-neutral-700 my-4 flex justify-between items-center   py-2 px-4">
            <p className="basis-3/4 text-neutral-200">Recycle all completed tasks.</p>

            <RecycleAllCompletedTasks
              addOptimisticTask={addOptimisticTask}
              className="shrink-0"
            />
          </div>

          <Tasks
            addOptimisticTask={addOptimisticTask}
            className={"my-8"}
            tasks={filteredCompletedTasks}
          />

          <Pagination pageCount={pageCount} currentPage={currentPage} />
        </>
      )}
    </div>
  )
}