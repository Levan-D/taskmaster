/** @format */
"use client"

import Icon from "@mdi/react"
import { mdiDotsVertical, mdiTrashCanOutline, mdiHeartOutline } from "@mdi/js"
import DropdownMenu from "../../DropdownMenu"
import { recycleTask } from "../../../actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

type Props = { taskId: string; expired: boolean }

export default function TaskDropDown({ taskId, expired }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRecycleTask = async () => {
    await recycleTask({ taskId: taskId })
    router.refresh()
  }

  const items: DropDownItemType = [
    {
      title: "Recycle",
      icon: <Icon path={mdiTrashCanOutline} size={0.7} />,
      action: () => {
        startTransition(handleRecycleTask)
        router.refresh()
      },
    },
  ]
  const button = (
    <div
      className={`${
        !expired ?"rounded-bl-lg ":"bg-neutral-600 shadow-sm sm:hover:bg-neutral-500"
      } hover:bg-neutral-600  rounded-tr-lg   p-2 duration-300`}
    >
      <Icon path={mdiDotsVertical} size={1} />
    </div>
  )
  return (
    <div className="flex">
      {expired && (
        <button className=" block bg-lime-600 shadow-sm sm:hover:bg-lime-500    rounded-bl-lg p-2 duration-300">
          <Icon path={mdiHeartOutline} size={1} />
        </button>
      )}
      <div>
        <DropdownMenu menuClassName="-translate-x-24" button={button} items={items} />
      </div>
    </div>
  )
}
