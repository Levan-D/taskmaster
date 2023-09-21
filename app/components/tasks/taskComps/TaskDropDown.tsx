/** @format */

import Icon from "@mdi/react"
import { mdiDotsVertical, mdiTrashCanOutline, mdiHeartOutline } from "@mdi/js"
import DropdownMenu from "../../DropdownMenu"
import { recycleTask, reviveTask } from "../../../actions/taskActions"
import { useTransition } from "react"
import { DateTime } from "luxon"

type Props = {
  task: Task
  expired: boolean
  addOptimisticTask: (action: Task[]) => void
}

export default function TaskDropDown({ task, expired, addOptimisticTask }: Props) {
  const [isPending, startTransition] = useTransition()
  console.log(expired)
  const today = DateTime.now().toISO() ?? ""

  const handleRecycleTask = async () => {
    addOptimisticTask([{ ...task, deleted: true, complete: false }])

    await recycleTask({ taskId: task.id })
  }

  const handleReviveTask = async () => {
    addOptimisticTask([{ ...task, due_date: today }])

    await reviveTask({ taskId: task.id, dueDate: today })
  }

  const items: DropDownItemType = [
    {
      title: "Recycle",
      invisible: task.deleted,
      icon: <Icon path={mdiTrashCanOutline} size={0.7} />,
      action: () => {
        startTransition(handleRecycleTask)
      },
    },
  ]
  const button = (
    <div
      className={`${
        expired || (task.complete && !task.deleted)
          ? "bg-neutral-600 shadow-sm sm:hover:bg-neutral-500"
          : "rounded-bl-lg"
      } hover:bg-neutral-600 rounded-tr-lg p-1 sm:p-2 duration-300`}
    >
      <Icon path={mdiDotsVertical} size={1} className="  scale-75 sm:scale-100 " />
    </div>
  )
  return (
    <div className="flex z-20 ">
      {expired && (
        <button
          disabled={isPending}
          onClick={() => {
            startTransition(handleReviveTask)
          }}
          className="p-1 sm:p-2 block bg-lime-600 shadow-sm sm:hover:bg-lime-500    rounded-bl-lg   duration-300"
        >
          <Icon className="  scale-75 sm:scale-100 " path={mdiHeartOutline} size={1} />
        </button>
      )}
      {task.complete && !task.deleted && (
        <button
          disabled={isPending}
          onClick={() => {
            startTransition(handleRecycleTask)
          }}
          className={`block bg-neutral-600 shadow-sm sm:hover:bg-neutral-500 border-r-[2px]  border-neutral-700    rounded-bl-lg p-1 sm:p-2 duration-300 `}
        >
          <Icon className="  scale-75 sm:scale-100 " path={mdiTrashCanOutline} size={1} />
        </button>
      )}
      <div>
        <DropdownMenu menuClassName="-translate-x-24 " button={button} items={items} />
      </div>
    </div>
  )
}
