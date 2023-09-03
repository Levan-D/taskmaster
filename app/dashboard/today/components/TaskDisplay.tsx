/** @format */

"use client"

import CreateTask from "@/app/components/tasks/taskComps/CreateTask"
import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { DateTime } from "luxon"
import { experimental_useOptimistic as useOptimistic } from "react"
import Accordion from "@/app/components/Accordion"
import TasksRevive from "@/app/components/tasks/taskComps/TasksRevive"
import TasksRecycle from "@/app/components/tasks/taskComps/TasksRecycle"

type Props = {
  tasks: Task[]
}

const filterExpiredTasks = (tasks: Task[], today: DateTime) =>
  tasks.filter((task: Task) => {
    if (!task.due_date || task.complete) return false
    const taskDueDate = DateTime.fromISO(task.due_date).startOf("day")
    return taskDueDate.hasSame(today, "day") === false && taskDueDate < today
  })

const filterTodayTasks = (tasks: Task[], today: DateTime) =>
  tasks
    .filter((task: Task) => {
      if (task.deleted) return false
      if (!task.due_date) return true
      const taskDueDate = DateTime.fromISO(task.due_date).startOf("day")
      return taskDueDate.hasSame(today, "day")
    })
    .map((task: Task) => ({
      ...task,
      steps: task.steps.filter((step: Step) => !step.deleted),
    }))

export default function TaskDisplay({ tasks }: Props) {
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state: Task[], updatedTasks: Task[]) => {
      const oldTasks = [...state]

      updatedTasks.forEach(updatedTask => {
        const taskIndex = oldTasks.findIndex(task => task.id === updatedTask.id)

        if (taskIndex !== -1) {
          oldTasks[taskIndex] = updatedTask
        } else if (updatedTask.id === "000") {
          oldTasks.unshift(updatedTask)
        }
      })

      return oldTasks
    }
  )
  const today = DateTime.now().startOf("day")

  const expiredTasks = filterExpiredTasks(optimisticTasks, today)
  const totalExpiredTasks = expiredTasks.filter((task: Task) => !task.deleted).length

  const todayTasks = filterTodayTasks(optimisticTasks, today)
  const totalTodaysTasks = todayTasks.length
  const todaysTasksCompleted = todayTasks.filter((task: Task) => task.complete).length

  const todaysTasksRatio = `${totalTodaysTasks}/${todaysTasksCompleted}`

  const allATodaysTasksCompleted =
    totalTodaysTasks === todaysTasksCompleted && totalTodaysTasks > 0

  return (
    <div>
      <CreateTask addOptimisticTask={addOptimisticTask} totalTasks={totalTodaysTasks} />

      {totalExpiredTasks > 0 && (
        <Accordion className="my-8" title={`Expired (${totalExpiredTasks})`}>
          <>
            <div className="mainContainer bg-neutral-700 my-4 flex items-center   py-2 px-4">
              <p className="basis-3/4 text-neutral-200">
                Expired tasks will auto recycle in 7 days. Either revive, recycle, or
                complete them.
              </p>
              <TasksRevive
                addOptimisticTask={addOptimisticTask}
                tasks={expiredTasks}
                className="shrink-0 mx-4 "
              />
              <TasksRecycle
                addOptimisticTask={addOptimisticTask}
                tasks={expiredTasks}
                className="shrink-0"
              />
            </div>

            <Tasks addOptimisticTask={addOptimisticTask} expired tasks={expiredTasks} />
          </>
        </Accordion>
      )}

      {totalTodaysTasks > 0 && totalExpiredTasks > 0 && (
        <Accordion className="my-8" title={`Today (${todaysTasksRatio})`}>
          <Tasks
            addOptimisticTask={addOptimisticTask}
            className={"my-8"}
            tasks={todayTasks}
          />
        </Accordion>
      )}

      {totalTodaysTasks > 0 && totalExpiredTasks === 0 && (
        <>
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
          <Tasks
            addOptimisticTask={addOptimisticTask}
            className={"my-8"}
            tasks={todayTasks}
          />
        </>
      )}
    </div>
  )
}
