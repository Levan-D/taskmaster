/** @format */

import ToggleTaskComplete from "./ToggleTaskComplete"
import Steps from "../steps/Steps"
import RecycleTask from "./RecycleTask"
import TaskDropDown from "./TaskDropDown"
import TaskUpdate from "./TaskUpdate"

export default async function Task({ id, title, isComplete, steps, priority }: Task) {
  return (
    <div>
      <div
        className={`relative z-10 mainContainer sm:hover:border-neutral-600 transition-colors duration-300`}
      >
        <div className="flex items-center">
          <ToggleTaskComplete priority={priority} taskId={id} isComplete={isComplete} />
          <div className="grow truncate line-clamp-1">
            <TaskUpdate title={title} taskId={id} taskPriority={priority} />
          </div>
          <TaskDropDown taskId={id} />
        </div>

        <Steps taskId={id} steps={steps} taskIsComplete={isComplete} />
      </div>
      <RecycleTask taskId={id} taskIsComplete={isComplete} />
    </div>
  )
}
