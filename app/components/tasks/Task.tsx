/** @format */

import RecycleTask from "./RecycleTask"
import ToggleTaskComplete from "./ToggleTaskComplete"
import Steps from "./Steps"
import CreateStep from "./CreateStep"

type Props = {
  id: string
  title: string
  deleted: boolean
  state: boolean
  creationDate: Date
  dueDate: Date | null
  priority: TaskPriority
  userId: string
}

export default function Task({ id, title, state }: Props) {
  return (
    <div className="bg-neutral-900 rounded-lg ">
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
