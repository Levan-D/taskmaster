/** @format */

"use client"
import { toggleTaskComplete } from "@/app/actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Icon from "@mdi/react"
import { mdiCheckBold } from "@mdi/js"

type Props = { taskId: string; state: boolean }

export default function ToggleTaskComplete({ taskId, state }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <button
      className={` ${
        state
          ? "bg-lime-600 md:hover:bg-lime-500"
          : "bg-neutral-700 md:hover:bg-neutral-600"
      } block  rounded-tl-lg p-2 duration-300 md:hover:bg-neutral-600`}
      onClick={() => {
        startTransition(() => toggleTaskComplete({ taskId: taskId, state: !state }))
        router.refresh()
      }}
    >
      <Icon path={mdiCheckBold} size={1} />
    </button>
  )
}
