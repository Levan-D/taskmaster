/** @format */
"use client"
import { useState, useEffect } from "react"
import ToggleTaskComplete from "./ToggleTaskComplete"
import Steps from "../steps/Steps"
import TaskDropDown from "./TaskDropDown"
import TaskUpdate from "./TaskUpdate"

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

  const isOptimistic = task.id === "optimistic"
  const isBeingDeleted = task.beingDeleted
  const isBeingCompleted = task.beingCompleted

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
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`mainContainer sm:hover:border-neutral-600 transition-colors duration-300 taskWrapper
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
