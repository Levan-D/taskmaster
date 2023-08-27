/** @format */

"use client"
import { toggleStepComplete } from "@/app/actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Icon from "@mdi/react"
import { mdiCheckBold } from "@mdi/js"

type Props = { stepId: string; state: boolean }

export default function ToggleStepComplete({ stepId, state }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <button
      className={` ${
        state
          ? "bg-lime-600 md:hover:bg-lime-500"
          : "bg-neutral-700 md:hover:bg-neutral-600"
      } block  rounded-full p-1 duration-300 md:hover:bg-neutral-600`}
      onClick={() => {
        startTransition(() => toggleStepComplete({ stepId: stepId, state: !state }))
        router.refresh()
      }}
    >
      <Icon path={mdiCheckBold} size={0.8} />
    </button>
  )
}
