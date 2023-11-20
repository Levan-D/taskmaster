/** @format */

import React from "react"
import { useTransition } from "react"
import { deleteAllTasks } from "@/app/actions/taskActions"
import Icon from "@mdi/react"
import { mdiSkullOutline } from "@mdi/js"

type Props = {
  className?: string
  addOptimisticTask: (action: Task[]) => void
}

export default function DeleteAllTasks({
  className,

  addOptimisticTask,
}: Props) {
  const [isPending, startTransition] = useTransition()

  const handleDeleteTasks = () => {
    startTransition(async () => {
      try {
        addOptimisticTask([])
        await deleteAllTasks()
      } catch (error) {
        console.error("Failed to delete  all tasks:", error)
      }
    })
  }

  return (
    <button
      aria-label="Delete all tasks"
      disabled={isPending}
      onClick={handleDeleteTasks}
      className={`${className} btnError flex gap-2 items-center  shrink-0 px-4`}
    >
      <Icon path={mdiSkullOutline} size={0.8} />
      <p> Delete All</p>
    </button>
  )
}
