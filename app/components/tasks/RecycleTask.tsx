/** @format */

"use client"
import { recycleTask } from "../../actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

type Props = { taskId: string }

export default function RecycleTask({ taskId }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <button
      onClick={() => {
        startTransition(() => recycleTask({ taskId: taskId }))
        router.refresh()
      }}
    >
      delete
    </button>
  )
}
