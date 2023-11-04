/** @format */

"use client"

import { useState, useEffect } from "react"
import CreateTask from "@/app/components/tasks/taskComps/CreateTask"
import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { DateTime } from "luxon"
import { useOptimistic } from "react"
import Accordion from "@/app/components/Accordion"
import TasksRevive from "@/app/components/tasks/taskComps/TasksRevive"
import TasksRecycle from "@/app/components/tasks/taskComps/TasksRecycle"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { setTodaysOps } from "@/lib/redux/slices/globalSlice"
import Loader from "@/app/components/Loader"
import TaskCounter from "@/app/components/tasks/TaskCounter"

type Props = {
  tasks: Task[]
}

const filterExpiredTasks = (tasks: Task[], today: DateTime) => {
  const yesterday = today.minus({ days: 1 }).startOf("day")

  return tasks
    .filter((task: Task) => {
      if (!task.due_date || task.complete || task.repeat || task.deleted) return false

      const taskDueDate = DateTime.fromJSDate(task.due_date).startOf("day")
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
      if (task.deleted || task.repeat) return false

      if (!task.due_date) return true
      const taskDueDate = DateTime.fromJSDate(task.due_date).startOf("day")
      return taskDueDate.hasSame(today, "day")
    })
    .map((task: Task) => ({
      ...task,
      steps: task.steps.filter((step: Step) => !step.deleted),
    }))

export default function TaskDisplay({ tasks }: Props) {
  const [message, setMessage] = useState<null | JSX.Element>(null)
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
        setTimeout(() => {
          setTodaysOp()
        }, 0)
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

  useEffect(() => {
    if (todaysOps) {
      setMessage(
        <div className={`  mb-28 text-center text-sm sm:text-base `}>
          <h2 className="  text-xl sm:text-2xl font-semibold mb-2">Congratulations!</h2>
          <p className="text-neutral-300">You&apos;ve completed all your tasks</p>
          <p className="text-neutral-300">Kick back and enjoy the rest of your day</p>
        </div>
      )
    } else
      setMessage(
        <div className={`  mb-28 text-center text-sm sm:text-base`}>
          <h2 className="text-2xl font-semibold mb-2">Hello there</h2>
          <p className="text-neutral-300">
            Add tasks below and start your day organized!
          </p>
          <br />
        </div>
      )
  }, [])

  if (optimisticTasksLength === 0 && message === null) return <Loader />

  return (
    <div className={` pb-4 `}>
      <div
        className={` ${
          optimisticTasksLength === 0 && "pt-[12vh]"
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

      {totalExpiredTasks > 0 && (
        <Accordion
          className="my-8 text-sm sm:text-base"
          title={`Expired (${totalExpiredTasks})`}
        >
          <>
            <div className="mainContainer bg-neutral-700 my-4   items-center   py-2 px-4 flex gap-4 flex-col  sm:flex-row text-center sm:text-left">
              <p className="basis-3/4 text-neutral-200">
                Yesterday&lsquo;s expired tasks will be moved to missed section in a day
                and will be recycled in a week.
              </p>

              <div className="flex gap-4     shrink-0 ">
                <TasksRevive
                  addOptimisticTask={addOptimisticTask}
                  tasks={expiredTasks}
                  className="shrink-0   "
                />
                <TasksRecycle
                  addOptimisticTask={addOptimisticTask}
                  tasks={expiredTasks}
                  className="shrink-0"
                />
              </div>
            </div>

            <Tasks addOptimisticTask={addOptimisticTask} expired tasks={expiredTasks} />
          </>
        </Accordion>
      )}
      {totalTodaysTasks > 0 && totalExpiredTasks > 0 && todaysTasksNotCompleted > 0 && (
        <Accordion
          className="my-8 text-sm sm:text-base"
          title={`Pending (${todaysTasksNotCompleted})`}
        >
          <Tasks
            addOptimisticTask={addOptimisticTask}
            className={"my-8"}
            tasks={todaysUnfinished}
          />
        </Accordion>
      )}

      {totalTodaysTasks > 0 && totalExpiredTasks === 0 && (
        <TaskCounter total={totalTodaysTasks} completed={todaysTasksCompleted} />
      )}

      {todaysTasksNotCompleted > 0 && totalExpiredTasks === 0 && (
        <Tasks
          addOptimisticTask={addOptimisticTask}
          className={"my-8"}
          tasks={todaysUnfinished}
        />
      )}
      {todaysTasksCompleted > 0 && (
        <Accordion
          className="my-8 text-sm sm:text-base "
          title={`Finished (${todaysTasksCompleted})`}
        >
          <>
            <div className="mainContainer bg-neutral-700 my-4    justify-between items-center   py-2 px-4 flex gap-4 flex-col  sm:flex-row text-center sm:text-left">
              <p className="basis-3/4 text-neutral-200 text-sm sm:text-base">
                Recycle completed tasks for today.
              </p>

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
