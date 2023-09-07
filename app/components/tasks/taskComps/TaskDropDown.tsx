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
      icon: <Icon path={mdiTrashCanOutline} size={0.7} />,
      action: () => {
        startTransition(handleRecycleTask)
      },
    },
  ]
  const button = (
    <div
      className={`${
        expired || task.complete
          ? "bg-neutral-600 shadow-sm sm:hover:bg-neutral-500"
          : "rounded-bl-lg"
      } hover:bg-neutral-600 rounded-tr-lg p-2 duration-300`}
    >
      <Icon path={mdiDotsVertical} size={1} />
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
          className=" block bg-lime-600 shadow-sm sm:hover:bg-lime-500    rounded-bl-lg p-2 duration-300"
        >
          <Icon path={mdiHeartOutline} size={1} />
        </button>
      )}
      {task.complete && (
        <button
          disabled={isPending}
          onClick={() => {
            startTransition(handleRecycleTask)
          }}
          className={`block bg-neutral-600 shadow-sm sm:hover:bg-neutral-500 border-r-[2px]  border-neutral-700    rounded-bl-lg p-2 duration-300 `}
        >
          <Icon path={mdiTrashCanOutline} size={1} />
        </button>
      )}
      <div>
        <DropdownMenu menuClassName="-translate-x-24" button={button} items={items} />
      </div>
    </div>
  )
}
