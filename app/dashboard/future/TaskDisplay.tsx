/** @format */

"use client"

import { useState, useEffect } from "react"
import CreateTask from "@/app/components/tasks/taskComps/CreateTask"
import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { experimental_useOptimistic as useOptimistic } from "react"
import { DateTime } from "luxon"
import Loader from "@/app/components/Loader"

type Props = {
  tasks: Task[]
}

const filterFutureTasks = (tasks: Task[]) => {
  const oneWeekFromNow = DateTime.now().startOf("day").plus({ days: 7 }) // Date one week from now

  return tasks
    .filter((task: Task) => {
      if (task.deleted) return false

      const taskDueDate = DateTime.fromISO(task.due_date).startOf("day")

      // Check if the task's due date is between today (inclusive) and one week from now (exclusive)
      return taskDueDate > oneWeekFromNow
    })
    .map((task: Task) => ({
      ...task,
      steps: task.steps.filter((step: Step) => !step.deleted),
    }))
}

export default function TaskDisplay({ tasks }: Props) {
  const [message, setMessage] = useState<null | JSX.Element>(null)

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

  const optimisticTasksLength = optimisticTasks.filter(
    (task: Task) => !task.deleted
  ).length

  const todayTasks = filterFutureTasks(optimisticTasks)
  const todaysUnfinished = todayTasks.filter((task: Task) => !task.complete)
  const todaysFinished = todayTasks.filter((task: Task) => task.complete)

  const totalTodaysTasks = todayTasks.length
  const todaysTasksCompleted = todaysFinished.length
  const todaysTasksNotCompleted = todaysUnfinished.length

  const todaysTasksRatio = `${totalTodaysTasks}/${todaysTasksCompleted}`

  const allATodaysTasksCompleted =
    totalTodaysTasks === todaysTasksCompleted && totalTodaysTasks > 0

  useEffect(() => {
    setMessage(
      <div className={`  mb-28 text-center text-sm sm:text-base`}>
        <h2 className="text-2xl font-semibold mb-2">Hello there</h2>
        <p className="text-neutral-300">
          Looks like you don&apos;t have any tasks set far in the future.
        </p>
        <p className="text-neutral-300">
          Get started by selecting the custom date and entering your task below!
        </p>

        <br />
      </div>
    )
  }, [])

  if (optimisticTasksLength === 0 && message === null)
    return (
      <div className="h-screen">
        <Loader />
      </div>
    )

  return (
    <div className={` py-4 `}>
      <div
        className={` ${
          optimisticTasksLength === 0 && "pt-[20vh]"
        } mt-0 transition-[padding] duration-500 `}
      >
        {optimisticTasksLength === 0 && message}

        <CreateTask
          defaultDate="Today"
          defaultPriority="LOW"
          addOptimisticTask={addOptimisticTask}
          taskLimit={19}
        />
      </div>

      {totalTodaysTasks > 0 && (
        <div className="flex items-center select-none mt-10 mb-12">
          <hr
            className={` ${
              allATodaysTasksCompleted ? "  border-lime-400" : "  border-neutral-500"
            } mx-4  block grow border-t-[1px]  border-opacity-75`}
          />
          <div
            className={`${
              allATodaysTasksCompleted ? "text-lime-400 " : "text-neutral-500 "
            }  p-1.5 text-sm  shrink-0 `}
          >
            {todaysTasksRatio}
          </div>
          <hr
            className={` ${
              allATodaysTasksCompleted ? "  border-lime-400" : "  border-neutral-500"
            } mx-4    block grow border-t-[1px]  border-opacity-75`}
          />
        </div>
      )}

      {todaysTasksNotCompleted > 0 && (
        <Tasks
          addOptimisticTask={addOptimisticTask}
          className={"my-8"}
          tasks={todaysUnfinished}
        />
      )}
    </div>
  )
}
