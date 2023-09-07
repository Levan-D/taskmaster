/** @format */

"use client"

import CreateTask from "@/app/components/tasks/taskComps/CreateTask"
import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { DateTime } from "luxon"
import { experimental_useOptimistic as useOptimistic } from "react"
import Accordion from "@/app/components/Accordion"
import TasksRevive from "@/app/components/tasks/taskComps/TasksRevive"
import TasksRecycle from "@/app/components/tasks/taskComps/TasksRecycle"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { setTodaysOps } from "@/lib/redux/slices/globalSlice"

type Props = {
  tasks: Task[]
}

const filterExpiredTasks = (tasks: Task[], today: DateTime) => {
  const yesterday = today.minus({ days: 1 }).startOf("day")

  return tasks
    .filter((task: Task) => {
      if (!task.due_date || task.complete) return false

      const taskDueDate = DateTime.fromISO(task.due_date).startOf("day")
      return taskDueDate.hasSame(yesterday, "day")
    })
    .map((task: Task) => ({
      ...task,
      steps: task.steps.filter((step: Step) => !step.deleted),
    }))
}

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
  const { todaysOps } = useAppSelector(state => state.global)
  const dispatch = useAppDispatch()

  const today = DateTime.now().startOf("day")

  const setTodaysOp = () => {
    const isoString = today.toISO()
    if (isoString) {
      const lastOpConvertToDateTime = DateTime.fromISO(isoString).startOf("day")
      dispatch(setTodaysOps(today.hasSame(lastOpConvertToDateTime, "day")))
      localStorage.setItem("todaysLastOp", isoString)
    }
  }

  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state: Task[], updatedTasks: Task[]) => {
      // set todays last operation
      if (typeof window !== "undefined") {
        setTodaysOp()
      }
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

  const expiredTasks = filterExpiredTasks(optimisticTasks, today)
  const totalExpiredTasks = expiredTasks.filter((task: Task) => !task.deleted).length

  const todayTasks = filterTodayTasks(optimisticTasks, today)
  const todaysUnfinished = todayTasks.filter((task: Task) => !task.complete)
  const todaysFinished = todayTasks.filter((task: Task) => task.complete)

  const totalTodaysTasks = todayTasks.length
  const todaysTasksCompleted = todaysFinished.length
  const todaysTasksNotCompleted = todaysUnfinished.length

  const todaysTasksRatio = `${totalTodaysTasks}/${todaysTasksCompleted}`

  const allATodaysTasksCompleted =
    totalTodaysTasks === todaysTasksCompleted && totalTodaysTasks > 0

  if (optimisticTasksLength === 0 && todaysOps === undefined)
    return (
      <div className="w-fit mx-auto min-h-screen flex flex-col justify-center   ">
        <div className="loader"></div>
      </div>
    )

  return (
    <div className={` py-4 `}>
      <div
        className={` ${
          optimisticTasksLength === 0 && "pt-[20vh]"
        } mt-0 transition-[padding] duration-500 `}
      >
        {optimisticTasksLength === 0 &&
          (todaysOps ? (
            <div className={`  mb-28 text-center`}>
              <h2 className="text-2xl font-semibold mb-2">Congratulations!</h2>
              <p className="text-neutral-300">You&apos;ve completed all your tasks</p>
              <p className="text-neutral-300">Kick back and enjoy the rest of your day</p>
            </div>
          ) : (
            <div className={`  mb-28 text-center`}>
              <h2 className="text-2xl font-semibold mb-2">Hello there</h2>
              <p className="text-neutral-300">
                Add tasks below and start your day organized!
              </p>
              <br />
            </div>
          ))}

        <CreateTask
          defaultDate="Today"
          defaultPriority="LOW"
          addOptimisticTask={addOptimisticTask}
          taskLimit={19}
        />
      </div>

      {totalExpiredTasks > 0 && (
        <Accordion className="my-8" title={`Expired (${totalExpiredTasks})`}>
          <>
            <div className="mainContainer bg-neutral-700 my-4 flex items-center   py-2 px-4">
              <p className="basis-3/4 text-neutral-200">
                Yesterday&lsquo;s expired tasks will be moved to missed section in a day
                and will be recycled in a week.
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
      {totalTodaysTasks > 0 && totalExpiredTasks > 0 && todaysTasksNotCompleted > 0 && (
        <Accordion className="my-8" title={`Pending (${todaysTasksNotCompleted})`}>
          <Tasks
            addOptimisticTask={addOptimisticTask}
            className={"my-8"}
            tasks={todaysUnfinished}
          />
        </Accordion>
      )}

      {totalTodaysTasks > 0 && totalExpiredTasks === 0 && (
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

      {todaysTasksNotCompleted > 0 && totalExpiredTasks === 0 && (
        <Tasks
          addOptimisticTask={addOptimisticTask}
          className={"my-8"}
          tasks={todaysUnfinished}
        />
      )}
      {todaysTasksCompleted > 0 && (
        <Accordion className="my-8" title={`Finished (${todaysTasksCompleted})`}>
          <>
            <div className="mainContainer bg-neutral-700 my-4 flex justify-between items-center   py-2 px-4">
              <p className="basis-3/4 text-neutral-200">Recycle completed tasks for today.</p>

              <TasksRecycle
                addOptimisticTask={addOptimisticTask}
                tasks={todaysFinished}
                className="shrink-0"
              />
            </div>

            <Tasks
              addOptimisticTask={addOptimisticTask}
              className={"my-8"}
              tasks={todaysFinished}
            />
          </>
        </Accordion>
      )}
    </div>
  )
}
