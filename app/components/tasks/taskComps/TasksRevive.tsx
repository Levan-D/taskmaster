/** @format */

import React from "react"
import { useTransition } from "react"
import { DateTime } from "luxon"
import { reviveTasks } from "@/app/actions/taskActions"

type Props = {
  className?: string
  tasks: Task[]
  addOptimisticTask: (action: Task[]) => void
}

export default function TasksRevive({ className, tasks, addOptimisticTask }: Props) {
  const [isPending, startTransition] = useTransition()
  const expiredTaskIds = tasks.map(task => task.id)
  const today = DateTime.now().toISO() ?? ""

  const handleReviveTasks = async () => {
    if (expiredTaskIds.length === 0) return

    const updatedTasks = tasks.map(task => {
      return { ...task, due_date: today }
    })
    addOptimisticTask(updatedTasks)

    await reviveTasks({ taskIds: expiredTaskIds, dueDate: today })
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(handleReviveTasks)
      }}
      className={`${className} btnSecondary bg-lime-600    px-4 sm:hover:bg-lime-500`}
    >
      Revive All
    </button>
  )
}
