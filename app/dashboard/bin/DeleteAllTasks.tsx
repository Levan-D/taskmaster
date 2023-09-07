/** @format */

import React from "react"
import { useTransition } from "react"
import { deleteAllTasks } from "@/app/actions/taskActions"

type Props = {
  className?: string
  addOptimisticTask: (action: Task[]) => void
}

export default function DeleteAllTasks({
  className,

  addOptimisticTask,
}: Props) {
  const [isPending, startTransition] = useTransition()

  const handleDeleteTasks = async () => {
    addOptimisticTask([])

    await deleteAllTasks()
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(handleDeleteTasks)
      }}
      className={`${className} btnError   px-4`}
    >
      Delete All
    </button>
  )
}
