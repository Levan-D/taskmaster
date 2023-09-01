/** @format */

"use client"
import { recycleStep } from "../../../actions"
import { useTransition } from "react"
import Icon from "@mdi/react"
import { mdiTrashCanOutline } from "@mdi/js"

type Props = {
  task: Task
  step: Step
  addOptimisticTask: (action: Task[]) => void
}
export default function RecycleStep({ task, step, addOptimisticTask }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleRecycleStep = async () => {
    addOptimisticDelete(true)
    await recycleStep({ stepId: stepId })
  }

  return (
    <button
      disabled={isPending}
      className="btnError"
      onClick={() => {
        startTransition(handleRecycleStep)
      }}
    >
      <Icon path={mdiTrashCanOutline} size={0.8} />
    </button>
  )
}
