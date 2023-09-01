/** @format */
"use client"

import Icon from "@mdi/react"
import { mdiDotsVertical, mdiTrashCanOutline, mdiHeartOutline } from "@mdi/js"
import DropdownMenu from "../../DropdownMenu"
import { recycleTask, reviveTask } from "../../../actions"
import { useTransition } from "react"
import { DateTime } from "luxon"

type Props = { taskId: string; expired: boolean; taskComplete: boolean }

export default function TaskDropDown({ taskId, expired, taskComplete }: Props) {
  const [isPending, startTransition] = useTransition()

  const today = DateTime.now().toISO() ?? ""

  const handleRecycleTask = async () => {
    await recycleTask({ taskId: taskId })
  }

  const handleReviveTask = async () => {
    await reviveTask({ taskId: taskId, dueDate: today })
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
        expired || taskComplete
          ? "bg-neutral-600 shadow-sm sm:hover:bg-neutral-500"
          : "rounded-bl-lg"
      } hover:bg-neutral-600 rounded-tr-lg p-2 duration-300`}
    >
      <Icon path={mdiDotsVertical} size={1} />
    </div>
  )
  return (
    <div className="flex">
      {expired && (
        <button
          onClick={() => {
            startTransition(handleReviveTask)
          }}
          className=" block bg-lime-600 shadow-sm sm:hover:bg-lime-500    rounded-bl-lg p-2 duration-300"
        >
          <Icon path={mdiHeartOutline} size={1} />
        </button>
      )}
      {taskComplete && (
        <button
          onClick={() => {
            startTransition(handleRecycleTask)
          }}
          className={`block bg-rose-600 shadow-sm sm:hover:bg-rose-500    rounded-bl-lg p-2 duration-300 `}
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
