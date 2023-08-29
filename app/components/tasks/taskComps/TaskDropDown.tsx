/** @format */
"use client"

import Icon from "@mdi/react"
import { mdiDotsVertical, mdiTrashCanOutline } from "@mdi/js"
import DropdownMenu from "../../DropdownMenu"
import { recycleTask } from "../../../actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

type Props = { taskId: string }

export default function TaskDropDown({ taskId }: Props) {
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
    <div className="  hover:bg-neutral-600  rounded-tr-lg rounded-bl-lg p-2 duration-300">
      <Icon path={mdiDotsVertical} size={1} />
    </div>
  )
  return (
    <div>
      <DropdownMenu button={button} items={items} />
    </div>
  )
}
