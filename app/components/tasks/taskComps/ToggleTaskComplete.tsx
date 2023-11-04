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
    startTransition(() => {
      addOptimisticTask([
        {
          ...task,
          complete: !task.complete,
          beingCompleted: task.complete ? "up" : "down",
        },
      ])

      setTimeout(() => {
        toggleTaskComplete({ taskId: task.id, complete: !task.complete })
      }, 4000)
    })
  }

  const getColor = () => {
    if (task.complete || task.beingCompleted) return "text-white"
    switch (task.priority) {
      case "LOW":
        return "text-sky-400"
      case "MEDIUM":
        return "text-amber-400"
      default:
        return "text-rose-400"
    }
  }

  return (
    <button
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
