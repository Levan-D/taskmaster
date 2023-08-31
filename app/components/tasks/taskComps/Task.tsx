/** @format */

import ToggleTaskComplete from "./ToggleTaskComplete"
import Steps from "../steps/Steps"
import TaskDropDown from "./TaskDropDown"
import TaskUpdate from "./TaskUpdate"

type Props = Task & { expired: boolean }

export default async function Task({
  id,
  title,
  complete,
  steps,
  priority,
  due_date,
  expired,
}: Props) {
  return (
    <div
      className={`relative z-10 mainContainer sm:hover:border-neutral-600 transition-colors duration-300`}
    >
      <div className="flex items-center">
        <ToggleTaskComplete priority={priority} taskId={id} complete={complete} />

        <TaskUpdate
          className="grow truncate line-clamp-1"
          title={title}
          taskId={id}
          taskPriority={priority}
        />

        <TaskDropDown expired={expired} taskId={id} taskComplete={complete} />
      </div>
      <Steps due_date={due_date} taskId={id} steps={steps} taskcomplete={complete} />
    </div>
  )
}
