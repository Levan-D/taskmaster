/** @format */

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
  return (
    <div
      className={`${
        task.deleted && "hidden"
      }   z-10 mainContainer  sm:hover:border-neutral-600 transition-colors duration-300`}
    >
      <div className="flex items-center">
        <ToggleTaskComplete addOptimisticTask={addOptimisticTask} task={task} />

        <TaskUpdate
          addOptimisticTask={addOptimisticTask}
          task={task}
          className="grow truncate line-clamp-1"
        />

        <TaskDropDown
          addOptimisticTask={addOptimisticTask}
          task={task}
          expired={expired}
        />
      </div>
      <Steps addOptimisticTask={addOptimisticTask} task={task} />
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
