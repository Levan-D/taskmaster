/** @format */

"use client"
import { toggleTaskComplete } from "@/app/actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Icon from "@mdi/react"
import { mdiCheckBold } from "@mdi/js"

type Props = { taskId: string; isComplete: boolean; priority: TaskPriority }

export default function ToggleTaskComplete({ taskId, isComplete, priority }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggleTaskComplete = async () => {
    await toggleTaskComplete({ taskId: taskId, isComplete: !isComplete })
    router.refresh()
  }

  return (
    <button
      className={` ${
        isComplete
          ? "bg-lime-600 md:hover:bg-lime-500"
          : "bg-neutral-950 md:hover:bg-neutral-900"
      } block  rounded-tl-lg rounded-br-lg p-2 duration-300 transition-colors `}
      onClick={() => {
        startTransition(handleToggleTaskComplete)
        router.refresh()
      }}
    >
      <Icon
        path={mdiCheckBold}
        className={`${
          isComplete
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
