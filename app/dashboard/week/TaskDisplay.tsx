/** @format */

"use client"

import { useState, useEffect } from "react"
import CreateTask from "@/app/components/tasks/taskComps/CreateTask"
import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { DateTime } from "luxon"
import { experimental_useOptimistic as useOptimistic } from "react"
import Accordion from "@/app/components/Accordion"
import TasksRecycle from "@/app/components/tasks/taskComps/TasksRecycle"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { setWeeksOps } from "@/lib/redux/slices/globalSlice"
import Loader from "@/app/components/Loader"
import TaskCounter from "@/app/components/tasks/TaskCounter"

type Props = {
  tasks: Task[]
}

const filterAndSortFutureTasks = (tasks: Task[], today: DateTime) => {
  const startFromTomorrow = today.plus({ days: 1 }).startOf("day")
  const oneWeekFromTomorrow = today.plus({ days: 8 }).startOf("day")

  const filteredTasks = tasks
    .filter((task: Task) => {
      if (task.deleted) return false
      if (!task.due_date) return false

      const taskDueDate = DateTime.fromJSDate(task.due_date).startOf("day")

      return taskDueDate >= startFromTomorrow && taskDueDate <= oneWeekFromTomorrow
    })
    .map((task: Task) => ({
      ...task,
      steps: task.steps.filter((step: Step) => !step.deleted),
    }))

  const sortedTasks = filteredTasks.sort((taskA: Task, taskB: Task) => {
    const dueDateA = DateTime.fromJSDate(taskA.due_date)
    const dueDateB = DateTime.fromJSDate(taskB.due_date)
    const creationDateA = taskA.creation_date.getTime()
    const creationDateB = taskB.creation_date.getTime()

    if (dueDateA.valueOf() > dueDateB.valueOf()) {
      return -1
    } else if (dueDateA.valueOf() < dueDateB.valueOf()) {
      return 1
    } else {
      if (creationDateA > creationDateB) {
        return -1
      } else if (creationDateA < creationDateB) {
        return 1
      } else {
        return 0
      }
    }
  })

  return sortedTasks
}

export default function TaskDisplay({ tasks }: Props) {
  const [message, setMessage] = useState<null | JSX.Element>(null)
  const { weeksOps } = useAppSelector(state => state.global)
  const dispatch = useAppDispatch()

  const today = DateTime.now().startOf("day")

  const setWeeksOp = () => {
    const isoString = today.toISO()
    if (isoString) {
      const lastOpConvertToDateTime = DateTime.fromISO(isoString).startOf("day")
      dispatch(setWeeksOps(today.hasSame(lastOpConvertToDateTime, "day")))
      localStorage.setItem("weeksLastOp", isoString)
    }
  }

  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state: Task[], updatedTasks: Task[]) => {
      // set futures last operation
      if (typeof window !== "undefined") {
        setTimeout(() => {
          setWeeksOp()
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

  const weeksTasks = filterAndSortFutureTasks(optimisticTasks, today)

  const totalweeksTasks = weeksTasks.length

  const weeksUnfinished = weeksTasks.filter((task: Task) => !task.complete)
  const weeksFinished = weeksTasks.filter((task: Task) => task.complete)

  const weekTasksCompleted = weeksFinished.length

  const tasksGroupedByDate = weeksUnfinished.reduce(
    (acc: { [key: string]: Task[] }, task) => {
      const dueDate = DateTime.fromJSDate(task.due_date).toFormat("yyyy-MM-dd")
      if (!acc[dueDate]) {
        acc[dueDate] = []
      }
      acc[dueDate].push(task)
      return acc
    },
    {}
  )

  useEffect(() => {
    if (weeksOps) {
      setMessage(
        <div className={`mb-28 text-center text-sm sm:text-base`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Congratulations!</h2>
          <p className="text-neutral-300">You&apos;ve completed all your weekly tasks</p>
          <p className="text-neutral-300">Kick back and enjoy the rest of your week</p>
        </div>
      )
    } else
      setMessage(
        <div className={` mb-28 text-center text-sm sm:text-base`}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Hello there</h2>
          <p className="text-neutral-300">Add tasks below and organize your week</p>
          <br />
        </div>
      )
  }, [])

  const sortedDates = Object.keys(tasksGroupedByDate).sort()

  if (totalweeksTasks === 0 && message === null) return <Loader />

  return (
    <div className={` pb-4 `}>
      <div
        className={` ${
          totalweeksTasks === 0 && "pt-[12vh]"
        } mt-0 transition-[padding]   duration-500 `}
      >
        {totalweeksTasks === 0 && message}

        <CreateTask
          defaultDate="Tomorrow"
          defaultPriority="LOW"
          addOptimisticTask={addOptimisticTask}
          taskLimit={19}
        />
      </div>

      {totalweeksTasks > 0 && (
        <TaskCounter total={totalweeksTasks} completed={weekTasksCompleted} />
      )}

      {sortedDates.length === 1 ? (
        <Tasks
          addOptimisticTask={addOptimisticTask}
          className={"my-8"}
          tasks={tasksGroupedByDate[sortedDates[0]]}
        />
      ) : (
        sortedDates.map((date, i) => {
          const tasksForTheDay = tasksGroupedByDate[date]
          const numTasksForTheDay = tasksForTheDay.length

          return (
            <Accordion
              key={i}
              className="my-8 text-sm sm:text-base"
              title={`${DateTime.fromISO(date).toFormat(
                "EEEE, dd/MM/yy"
              )} (${numTasksForTheDay})`}
            >
              <>
                {/* Add any additional logic or elements here for each Accordion */}
                <Tasks
                  addOptimisticTask={addOptimisticTask}
                  className={"my-8"}
                  tasks={tasksForTheDay}
                />
              </>
            </Accordion>
          )
        })
      )}

      {weekTasksCompleted > 0 && (
        <Accordion
          className="my-8 text-sm sm:text-base"
          title={`Finished (${weekTasksCompleted})`}
        >
          <>
            <div className="mainContainer bg-neutral-700 my-4   justify-between items-center flex gap-4 flex-col  sm:flex-row text-center sm:text-left   py-2 px-4">
              <p className="basis-3/4 text-neutral-200  text-sm sm:text-base  ">
                Recycle completed tasks for the week.
              </p>

              <TasksRecycle
                addOptimisticTask={addOptimisticTask}
                tasks={weeksFinished}
                className="shrink-0"
              />
            </div>

            <Tasks
              addOptimisticTask={addOptimisticTask}
              className={"my-8"}
              tasks={weeksFinished}
            />
          </>
        </Accordion>
      )}
    </div>
  )
}
