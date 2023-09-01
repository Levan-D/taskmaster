/** @format */

"use client"
import { toggleTaskComplete } from "@/app/actions"
import { useTransition } from "react"
import Icon from "@mdi/react"
import { mdiCheckBold } from "@mdi/js"

type Props = {
  taskId: string
  complete: boolean
  priority: TaskPriority
  optimisticComplete: boolean
  addOptimisticComplete: (action: boolean) => void
}

export default function ToggleTaskComplete({
  taskId,
  complete,
  priority,
  optimisticComplete,
  addOptimisticComplete,
}: Props) {
  const [isPending, startTransition] = useTransition()

  const handleToggleTaskComplete = async () => {
    addOptimisticComplete(!complete)

    await toggleTaskComplete({ taskId: taskId, complete: !complete })
  }

  return (
    <button
      disabled={isPending}
      className={` ${
        optimisticComplete
          ? "bg-lime-600 md:hover:bg-lime-500"
          : "bg-neutral-950 md:hover:bg-neutral-900"
      } block  rounded-tl-lg rounded-br-lg p-2 duration-300 transition-colors `}
      onClick={() => startTransition(handleToggleTaskComplete)}
    >
      <Icon
        path={mdiCheckBold}
        className={`${
          optimisticComplete
            ? "text-white"
            : priority === "LOW"
            ? "text-sky-400"
            : priority === "MEDIUM"
            ? "text-amber-400"
            : "text-rose-400"
        }`}
        size={1}
      />
    </button>
  )
}
