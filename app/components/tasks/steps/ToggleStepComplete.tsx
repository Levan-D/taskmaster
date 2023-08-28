/** @format */

"use client"
import { toggleStepComplete } from "@/app/actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Icon from "@mdi/react"
import { mdiCheckBold } from "@mdi/js"

type Props = { stepId: string; isComplete: boolean }

export default function ToggleStepComplete({ stepId, isComplete }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggleStepComplete = async () => {
    await toggleStepComplete({ stepId: stepId, isComplete: !isComplete })
    router.refresh()
  }

  return (
    <button
      className={` ${
        isComplete
          ? "bg-lime-600 md:hover:bg-lime-500"
          : "bg-neutral-900 md:hover:bg-neutral-800"
      } block  rounded-md   p-1 duration-300 transition-colors `}
      onClick={() => {
        startTransition(handleToggleStepComplete)
        router.refresh()
      }}
    >
      <Icon
        path={mdiCheckBold}
        className={`${isComplete ? "text-white" : "text-neutral-300"}`}
        size={0.8}
      />
    </button>
  )
}
