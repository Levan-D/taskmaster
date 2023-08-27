/** @format */

"use client"
import { recycleTask } from "../../actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

type Props = { taskId: string }

export default function RecycleTask({ taskId }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRecycleTask = async () => {
    await recycleTask({ taskId: taskId })
    router.refresh()
  }

  return (
    <button
      onClick={() => {
        startTransition(handleRecycleTask)
        router.refresh()
      }}
    >
      delete
    </button>
  )
}
