/** @format */

"use client"
import { toggleComplete } from "@/app/actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

type Props = { taskId: string; state: boolean }

export default function ToggleComplete({ taskId, state }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <button
      onClick={() => {
        startTransition(() => toggleComplete({ taskId: taskId, state: !state }))
        router.refresh()
      }}
    >
      {state ? "complete" : "not complete"}
    </button>
  )
}
