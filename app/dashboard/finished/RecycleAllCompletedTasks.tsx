/** @format */

import React from "react"
import { useTransition } from "react"
import { recycleAllTasks } from "@/app/actions/taskActions"

type Props = {
  className?: string
  addOptimisticTask: (action: Task[]) => void
}

export default function RecycleAllCompletedTasks({
  className,

  addOptimisticTask,
}: Props) {
  const [isPending, startTransition] = useTransition()

  const handleRecycleTasks = async () => {
    addOptimisticTask([])

    await recycleAllTasks()
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(handleRecycleTasks)
      }}
      className={`${className} btnError   px-4`}
    >
      Recycle All
    </button>
  )
}
