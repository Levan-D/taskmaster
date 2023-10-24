/** @format */

import React from "react"
import { useTransition } from "react"
import { reviveAllMissedTasks } from "@/app/actions/taskActions"

type Props = {
  className?: string
  addOptimisticTask: (action: Task[]) => void
}

export default function ReviveAllMissedTasks({
  className,

  addOptimisticTask,
}: Props) {
  const [isPending, startTransition] = useTransition()

  const handleRecycleTasks = async () => {
    addOptimisticTask([])

    await reviveAllMissedTasks()
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(handleRecycleTasks)
      }}
      className={`${className} btnSecondary bg-lime-600    px-4 hover:bg-lime-500`}
    >
      Revive All
    </button>
  )
}
