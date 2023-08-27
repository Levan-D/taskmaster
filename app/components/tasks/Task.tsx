/** @format */

import RecycleTask from "./RecycleTask"
import ToggleTaskComplete from "./ToggleTaskComplete"
import Steps from "./Steps"
import CreateStep from "./CreateStep"
import TaskDropDown from "./TaskDropDown"
import { getSteps } from "@/app/actions"

export default function Task({ id, title, state }: Task) {
  return (
    <div className="mainContainer sm:hover:border-neutral-600 transition-colors duration-300 ">
      <div className="flex items-center">
        <ToggleTaskComplete taskId={id} state={state} />
        <p className="grow text-lg  mx-2 ">{title}</p>

        <TaskDropDown taskId={id} />
      </div>

      <div className="mb-2">
        <CreateStep taskId={id} />
        <Steps taskId={id} />
      </div>

      {/* <RecycleTask taskId={id} /> */}
    </div>
  )
}
