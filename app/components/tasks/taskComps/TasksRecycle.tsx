/** @format */
"use client"

import React from "react"
import { useTransition } from "react"
import { recycleTasks } from "@/app/actions"

type Props = {
  className?: string
  expiredTaskIds: string[] | []
}

export default function TasksRecycle({ className, expiredTaskIds }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleRecycleTasks = async () => {
    if (expiredTaskIds.length === 0) return

    await recycleTasks({ taskIds: expiredTaskIds })
  }

  return (
    <button
      onClick={() => {
        startTransition(handleRecycleTasks)
      }}
      className={`${className} btnError   px-4`}
    >
      Recycle All
    </button>
  )
}
