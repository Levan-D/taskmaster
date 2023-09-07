/** @format */

import React from "react"
import { useTransition } from "react"
import { recycleAllMissedTasks } from "@/app/actions/taskActions"

type Props = {
  className?: string
  addOptimisticTask: (action: Task[]) => void
}

export default function RecycleAllMissedTasks({
  className,

  addOptimisticTask,
}: Props) {
  const [isPending, startTransition] = useTransition()

  const handleRecycleTasks = async () => {
    addOptimisticTask([])

    await recycleAllMissedTasks()
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
