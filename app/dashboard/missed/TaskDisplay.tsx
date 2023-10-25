/** @format */

"use client"

import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { experimental_useOptimistic as useOptimistic } from "react"
import Pagination from "@/app/components/Pagination"
import TasksRecycle from "@/app/components/tasks/taskComps/TasksRecycle"
import TasksRevive from "@/app/components/tasks/taskComps/TasksRevive"

type Props = {
  tasks: Task[]
  pageCount: number
  currentPage: number
}

const filterMissedTasks = (tasks: Task[]) => {
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

  const filteredMissedTasks = filterMissedTasks(optimisticTasks)
  const totalMissedTasks = filteredMissedTasks.length

  return (
    <div className={` py-4  pt-14  sm:pt-4 `}>
      {totalMissedTasks === 0 ? (
        <div
          className={` ${
            totalMissedTasks === 0 && "pt-[12vh]"
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
            <div className="mainContainer bg-neutral-700 my-4 flex justify-between items-center   py-2 px-4   gap-4 flex-col  sm:flex-row text-center sm:text-left">
              <p className="basis-3/4 text-neutral-200 text-sm sm:text-base">
                Recycle or revive all missed tasks.
              </p>

              <div className="flex gap-4     shrink-0 ">
                <TasksRevive
                  addOptimisticTask={addOptimisticTask}
                  tasks={filteredMissedTasks}
                  className="shrink-0   "
                />
                <TasksRecycle
                  addOptimisticTask={addOptimisticTask}
                  tasks={filteredMissedTasks}
                  className="shrink-0"
                />
              </div>
            </div>

            <Tasks
              expired={true}
              addOptimisticTask={addOptimisticTask}
              className={"my-8"}
              tasks={filteredMissedTasks}
            />
          </div>

          <Pagination
            className="w-fit mx-auto my-16"
            pageCount={pageCount}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  )
}
