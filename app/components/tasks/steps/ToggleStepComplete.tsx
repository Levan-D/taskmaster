/** @format */

"use client"
import { toggleStepComplete } from "@/app/actions"
import { useTransition } from "react"
import Icon from "@mdi/react"
import { mdiCheckBold } from "@mdi/js"

type Props = {
  stepId: string
  complete: boolean
  optimisticComplete: boolean
  addOptimisticComplete: (action: boolean) => void
}

export default function ToggleStepComplete({
  stepId,
  complete,
  optimisticComplete,
  addOptimisticComplete,
}: Props) {
  const [isPending, startTransition] = useTransition()

  const handleToggleStepComplete = async () => {
    addOptimisticComplete(!complete)
    await toggleStepComplete({ stepId: stepId, complete: !complete })
  }

  return (
    <button
      disabled={isPending}
      className={` ${
        optimisticComplete
          ? "bg-lime-600 md:hover:bg-lime-500"
          : "bg-neutral-900 md:hover:bg-neutral-800"
      } block  rounded-md   p-1 duration-300 transition-colors `}
      onClick={() => {
        startTransition(handleToggleStepComplete)
      }}
    >
      <Icon
        path={mdiCheckBold}
        className={`${optimisticComplete ? "text-white" : "text-neutral-300"}`}
        size={0.8}
      />
    </button>
  )
}
