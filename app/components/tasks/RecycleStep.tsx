/** @format */

"use client"
import { recycleStep } from "../../actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

type Props = { stepId: string }

export default function RecycleStep({ stepId }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <button
      onClick={() => {
        startTransition(() => recycleStep({ stepId: stepId }))
        router.refresh()
      }}
    >
      delete
    </button>
  )
}
