/** @format */

import React from "react"
import { useTransition } from "react"
import { recycleAllCompletedTasks } from "@/app/actions/taskActions"

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

    await recycleAllCompletedTasks()
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(handleRecycleTasks)
      }}
      className={`${className} btnSecondary   px-4`}
    >
      Recycle All
    </button>
  )
}
