/** @format */
"use client"
import { useState, useEffect } from "react"
import ToggleTaskComplete from "./ToggleTaskComplete"
import Steps from "../steps/Steps"
import TaskDropDown from "./TaskDropDown"
import TaskUpdate from "./TaskUpdate"
import { Interval, DateTime } from "luxon"

type Props = {
  tasks: Task[]
  expired?: boolean
  className?: string
  addOptimisticTask: (action: Task[]) => void
}

type TaskProps = {
  task: Task
  expired: boolean
  addOptimisticTask: (action: Task[]) => void
}

function Task({ task, expired, addOptimisticTask }: TaskProps) {
  const [visible, setVisible] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [progressBarStyle, setProgressBarStyle] = useState({})

  const isOptimistic = task.id === "optimistic"
  const isBeingDeleted = task.beingDeleted
  const isBeingCompleted = task.beingCompleted

  useEffect(() => {
    if (!task.start_time && !task.end_time) return

    const updateProgressBar = () => {
      if (task.start_time && task.end_time) {
        const now = DateTime.now()
        const startTime = DateTime.fromJSDate(task.start_time)
        const endTime = DateTime.fromJSDate(task.end_time)

        const totalDuration = Interval.fromDateTimes(startTime, endTime).toDuration(
          "seconds"
        ).seconds
        const elapsedDuration = Interval.fromDateTimes(startTime, now).toDuration(
          "seconds"
        ).seconds

        const progressPercentage =
          totalDuration > 0 ? (elapsedDuration / totalDuration) * 100 : 0
        const safeProgressPercentage = Math.max(0, progressPercentage)

        const spread = 20
        const newProgressBarStyle = {
          background: `linear-gradient(to right, #65a30d ${
            safeProgressPercentage - spread
          }%,  RGBA(64, 64, 64,0.6) ${safeProgressPercentage + 5}%)`,
        }

        const baseBg = {
          background: `#65a30d`,
        }

        setProgressBarStyle(safeProgressPercentage >= 100 ? baseBg : newProgressBarStyle)

        if (safeProgressPercentage >= 100) {
          clearInterval(intervalId)
        }
      } else if (!task.start_time && !task.end_time) {
        setProgressBarStyle({
          background: `RGBA(64, 64, 64,0.6)`,
        })
      }
    }

    const intervalId = setInterval(updateProgressBar, 1000)

    return () => clearInterval(intervalId)
  }, [task.start_time, task.end_time])

  useEffect(() => {
    if (isOptimistic) {
      // Start the animation after the initial render
      setTimeout(() => {
        setAnimate(true)
      }, 0)
    }
  }, [])

  return (
    <div
      style={progressBarStyle}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`${
        expired && "opacity-75"
      }  bg-neutral-700 bg-opacity-60 p-0.5  shadow-md shadow-neutral-950   taskWrapper  rounded-lg
  ${
    isOptimistic && !animate
      ? "optimisticCreateStart"
      : isOptimistic && animate
      ? "optimisticCreateEnd"
      : ""
  } 
  ${isBeingDeleted && "deleteAnimation "}
  ${isBeingCompleted === "down" && "completedDown "}
  ${isBeingCompleted === "up" && "completedUp "}
   `}
    >
      <div className="mainContainer border-none  shadow-none">
        <div className="content">
          <div className="flex items-center">
            <ToggleTaskComplete
              expired={expired}
              addOptimisticTask={addOptimisticTask}
              task={task}
            />

            <TaskUpdate
              addOptimisticTask={addOptimisticTask}
              task={task}
              expired={expired}
              className=" grow    "
            />

            <TaskDropDown
              addOptimisticTask={addOptimisticTask}
              task={task}
              visible={visible}
              expired={expired}
            />
          </div>
          <Steps expired={expired} addOptimisticTask={addOptimisticTask} task={task} />
        </div>
      </div>
    </div>
  )
}

export default function Tasks({
  tasks,
  expired = false,
  className,
  addOptimisticTask,
}: Props) {
  return (
    <div className={`${className} flex flex-col gap-4`}>
      {tasks.map(task => (
        <Task
          addOptimisticTask={addOptimisticTask}
          expired={expired}
          key={task.id}
          task={task}
        />
      ))}
    </div>
  )
}
