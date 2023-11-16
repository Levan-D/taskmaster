/** @format */

import React from "react"
import { useTransition } from "react"
import { recycleTasks } from "@/app/actions/taskActions"

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

  const handleRecycleTasks = () => {
    if (expiredTaskIds.length === 0) return

    const updatedTasks = tasks.map(task => {
      return { ...task, deleted: true }
    })

    startTransition(async () => {
      try {
        addOptimisticTask(updatedTasks)
        await recycleTasks({ taskIds: expiredTaskIds })
      } catch (error) {
        console.error("Failed to recycle tasks:", error)
      }
    })
  }

  return (
    <button
      disabled={isPending}
      onClick={handleRecycleTasks}
      className={`${className} btnSecondary   px-4  `}
    >
      Recycle All
    </button>
  )
}
