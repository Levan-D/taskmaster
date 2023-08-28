/** @format */

import ToggleTaskComplete from "./ToggleTaskComplete"
import StepsWrapper from "../steps/StepsWrapper"
import TaskDropDown from "./TaskDropDown"
import { getSteps } from "@/app/actions"

export default async function Task({ id, title, isComplete }: Task) {
  const steps = await getSteps({ taskId: id, isDeleted: false })

  if (steps.success)
    return (
      <div className="mainContainer sm:hover:border-neutral-600 transition-colors duration-300 ">
        <div className="flex items-center">
          <ToggleTaskComplete taskId={id} isComplete={isComplete} />
          <p className="grow text-lg  mx-2 ">{title}</p>

          <TaskDropDown taskId={id} />
        </div>

        <StepsWrapper taskId={id} data={steps.data} taskIsComplete={isComplete} />
      </div>
    )
}
