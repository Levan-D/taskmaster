/** @format */

import ToggleTaskComplete from "./ToggleTaskComplete"
import StepsWrapper from "../steps/StepsWrapper"
import TaskDropDown from "./TaskDropDown"
import TaskUpdate from "./TaskUpdate"

export default async function Task({ id, title, isComplete, steps, priority }: Task) {
  return (
    <div
      className={`  mainContainer sm:hover:border-neutral-600 transition-colors duration-300`}
    >
      <div className="flex items-center">
        <ToggleTaskComplete priority={priority} taskId={id} isComplete={isComplete} />
        <div className="grow truncate line-clamp-1">
          <TaskUpdate title={title} taskId={id} taskPriority={priority} />
        </div>
        <TaskDropDown taskId={id} />
      </div>

      <StepsWrapper taskId={id} steps={steps} taskIsComplete={isComplete} />
    </div>
  )
}
