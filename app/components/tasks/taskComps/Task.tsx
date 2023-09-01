/** @format */
"use client"
import ToggleTaskComplete from "./ToggleTaskComplete"
import Steps from "../steps/Steps"
import TaskDropDown from "./TaskDropDown"
import TaskUpdate from "./TaskUpdate"
import { experimental_useOptimistic as useOptimistic } from "react"

type Props = Task & { expired: boolean }

export default function Task({
  id,
  title,
  complete,
  steps,
  priority,
  due_date,
  expired,
}: Props) {
  const [optimisticComplete, addOptimisticComplete] = useOptimistic(
    complete,
    (state, newComplete: boolean) => {
      return newComplete
    }
  )

  return (
    <div
      className={`relative z-10 mainContainer sm:hover:border-neutral-600 transition-colors duration-300`}
    >
      <div className="flex items-center">
        <ToggleTaskComplete
          addOptimisticComplete={addOptimisticComplete}
          optimisticComplete={optimisticComplete}
          priority={priority}
          taskId={id}
          complete={complete}
        />

        <TaskUpdate
          className="grow truncate line-clamp-1"
          title={title}
          taskId={id}
          taskPriority={priority}
        />

        <TaskDropDown
          optimisticComplete={optimisticComplete}
          expired={expired}
          taskId={id}
          taskComplete={complete}
        />
      </div>
      <Steps
        optimisticComplete={optimisticComplete}
        due_date={due_date}
        taskId={id}
        steps={steps}
        taskcomplete={complete}
      />
    </div>
  )
}
