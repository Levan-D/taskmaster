/** @format */

"use client"
import { toggleTaskComplete } from "@/app/actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Icon from "@mdi/react"
import { mdiCheckBold, mdiCheckOutline } from "@mdi/js"

type Props = { taskId: string; state: boolean }

export default function ToggleTaskComplete({ taskId, state }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggleTaskComplete = async () => {
    await toggleTaskComplete({ taskId: taskId, state: !state })
    router.refresh()
  }

  return (
    <button
      className={` ${
        state
          ? "bg-lime-600 md:hover:bg-lime-500"
          : "bg-neutral-950 md:hover:bg-neutral-900"
      } block  rounded-tl-lg rounded-br-lg p-2 duration-300 `}
      onClick={() => {
        startTransition(handleToggleTaskComplete)
        router.refresh()
      }}
    >
      <Icon
        path={mdiCheckBold}
        className={`${state ? "text-white" : "text-neutral-300"}`}
        size={1}
      />
    </button>
  )
}
