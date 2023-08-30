/** @format */

"use client"

import React from "react"
import Icon from "@mdi/react"
import { mdiDotsVertical, mdiTrashCanOutline } from "@mdi/js"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { recycleTask } from "../../../actions"

type Props = {
  taskIsComplete: boolean
  taskId: string
}

export default function RecycleTask({ taskIsComplete, taskId }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRecycleTask = async () => {
    await recycleTask({ taskId: taskId })
    router.refresh()
  }
  return (
    <button
      onClick={() => {
        startTransition(handleRecycleTask)
      }}
      className={`${
        taskIsComplete ? "-translate-y-3 " : "-translate-y-14  h-0"
      } justify-center hover:bg-neutral-700 ease-in-out  duration-300  flex mainContainer w-full  pt-4 px-2    pb-1  gap-2 items-center`}
    >
      <div>
        <Icon path={mdiTrashCanOutline} size={0.7} />
      </div>
      <div>Recycle</div>
    </button>
  )
}
