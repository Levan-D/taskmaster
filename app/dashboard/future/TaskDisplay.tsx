/** @format */

"use client"

import Accordion from "@/app/components/Accordion"
import { useState, useEffect } from "react"
import CreateTask from "@/app/components/tasks/taskComps/CreateTask"
import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { experimental_useOptimistic as useOptimistic } from "react"
import { DateTime } from "luxon"
import TasksRecycle from "@/app/components/tasks/taskComps/TasksRecycle"
import Loader from "@/app/components/Loader"
import TaskCounter from "@/app/components/tasks/TaskCounter"

type Props = {
  tasks: Task[]
}

const filterFutureTasks = (tasks: Task[]) => {
  const oneWeekFromNow = DateTime.now().startOf("day").plus({ days: 7 }) // Date one week from now

  return tasks
    .filter((task: Task) => {
      if (task.deleted) return false

      const taskDueDate = DateTime.fromJSDate(task.due_date).startOf("day")

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

  const futureTasks = filterFutureTasks(optimisticTasks)
  const futuresUnfinished = futureTasks.filter((task: Task) => !task.complete)
  const futuresFinished = futureTasks.filter((task: Task) => task.complete)

  const totalFuturesTasks = futureTasks.length
  const futuresTasksCompleted = futuresFinished.length
  const futuresTasksNotCompleted = futuresUnfinished.length

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
          defaultDate="Custom date"
          defaultPriority="LOW"
          addOptimisticTask={addOptimisticTask}
          taskLimit={19}
        />
      </div>

      {totalFuturesTasks > 0 && (
        <TaskCounter total={totalFuturesTasks} completed={futuresTasksCompleted} />
      )}

      {futuresTasksNotCompleted > 0 && (
        <Tasks
          addOptimisticTask={addOptimisticTask}
          className={"my-8"}
          tasks={futuresUnfinished}
        />
      )}

      {futuresTasksCompleted > 0 && (
        <Accordion
          className="my-8 text-sm sm:text-base"
          title={`Finished (${futuresTasksCompleted})`}
        >
          <>
            <div className="mainContainer bg-neutral-700 my-4   justify-between items-center flex gap-4 flex-col  sm:flex-row text-center sm:text-left   py-2 px-4">
              <p className="basis-3/4 text-neutral-200  text-sm sm:text-base  ">
                Recycle completed future tasks.
              </p>

              <TasksRecycle
                addOptimisticTask={addOptimisticTask}
                tasks={futuresFinished}
                className="shrink-0"
              />
            </div>

            <Tasks
              addOptimisticTask={addOptimisticTask}
              className={"my-8"}
              tasks={futuresFinished}
            />
          </>
        </Accordion>
      )}
    </div>
  )
}
