/** @format */
"use client"

import React from "react"
import { useTransition } from "react"
import { recycleTasks } from "@/app/actions"

type Props = {
  className?: string
  tasks: Task[]
  addOptimisticTask: (action: Task[]) => void
}

export default function TasksRecycle({
  className,

  addOptimisticTask,
  tasks,
}: Props) {
  const [isPending, startTransition] = useTransition()

  const expiredTaskIds = tasks.map(task => task.id)

  const handleRecycleTasks = async () => {
    if (expiredTaskIds.length === 0) return

    const recycledTasks = tasks.map(task => {
      return { ...task, deleted: true }
    })

    addOptimisticTask(recycledTasks)

    await recycleTasks({ taskIds: expiredTaskIds })
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
