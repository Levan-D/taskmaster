/** @format */
"use client"
import { toggleTaskComplete } from "@/app/actions/taskActions"
import { useTransition } from "react"
import Icon from "@mdi/react"
import { mdiCheckBold, mdiCheckOutline } from "@mdi/js"
import { useState } from "react"

type Props = {
  task: Task
  addOptimisticTask: (action: Task[]) => void
  expired: boolean
}

export default function ToggleTaskComplete({ task, addOptimisticTask, expired }: Props) {
  const [isPending, startTransition] = useTransition()
  const [hovering, setHovering] = useState(false)

  const handleToggleTaskComplete = () => {
    startTransition(async () => {
      addOptimisticTask([
        {
          ...task,
          beingCompleted: task.complete ? "up" : "down",
        },
      ])

      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        addOptimisticTask([
          {
            ...task,
            complete: !task.complete,
          },
        ])
        await toggleTaskComplete({ taskId: task.id, complete: !task.complete })
      } catch (error) {
        console.error("Failed to toggle task completion:", error)
      }
    })
  }

  const getColor = () => {
    if (task.complete || task.beingCompleted) return "text-white"
    switch (task.priority) {
      case "LOW":
        return "text-indigo-400"
      case "MEDIUM":
        return "text-amber-400"
      default:
        return "text-rose-400"
    }
  }

  return (
    <button
      aria-label="Toggle task complete"
      disabled={isPending || task.deleted || expired}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={` ${
        task.complete || task.beingCompleted
          ? "bg-lime-600 md:hover:bg-lime-500"
          : "bg-neutral-950 md:hover:bg-neutral-900"
      } block  rounded-tl-lg rounded-br-lg p-1 sm:p-2 duration-300 transition-colors   `}
      onClick={handleToggleTaskComplete}
    >
      <Icon
        path={task.complete || hovering ? mdiCheckBold : mdiCheckOutline}
        className={`${getColor()} scale-75 sm:scale-100`}
        size={1}
      />
    </button>
  )
}
