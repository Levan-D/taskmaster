/** @format */

"use client"
import { toggleStepComplete } from "@/app/actions"
import { useTransition } from "react"
import Icon from "@mdi/react"
import { mdiCheckBold } from "@mdi/js"

type Props = { stepId: string; complete: boolean }

export default function ToggleStepComplete({ stepId, complete }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleToggleStepComplete = async () => {
    await toggleStepComplete({ stepId: stepId, complete: !complete })
  }

  return (
    <button
      className={` ${
        complete
          ? "bg-lime-600 md:hover:bg-lime-500"
          : "bg-neutral-900 md:hover:bg-neutral-800"
      } block  rounded-md   p-1 duration-300 transition-colors `}
      onClick={() => {
        startTransition(handleToggleStepComplete)
      }}
    >
      <Icon
        path={mdiCheckBold}
        className={`${complete ? "text-white" : "text-neutral-300"}`}
        size={0.8}
      />
    </button>
  )
}
