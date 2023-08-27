/** @format */

import RecycleTask from "./RecycleTask"
import ToggleTaskComplete from "./ToggleTaskComplete"
import Steps from "./Steps"
import CreateStep from "./CreateStep"

export default function Task({ id, title, state }: Task) {
  return (
    <div className="mainContainer ">
      <div className="flex items-center">
        <ToggleTaskComplete taskId={id} state={state} />
        <p className="grow text-lg  mx-2 ">{title}</p>

        <div>drop</div>
      </div>

      <CreateStep taskId={id} />
      <Steps taskId={id} />

      {/* <RecycleTask taskId={id} /> */}
    </div>
  )
}
