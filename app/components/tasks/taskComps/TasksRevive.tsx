/** @format */
"use client"

import React from "react"
import { useTransition } from "react"
import { DateTime } from "luxon"
import { reviveTasks } from "@/app/actions"

type Props = {
  className?: string
  expiredTaskIds: string[] | []
}

export default function TasksRevive({ className, expiredTaskIds }: Props) {
  const [isPending, startTransition] = useTransition()

  const today = DateTime.now().toISO() ?? ""

  const handleReviveTasks = async () => {
    if (expiredTaskIds.length === 0) return

    await reviveTasks({ taskIds: expiredTaskIds, dueDate: today })
  }

  return (
    <button
      onClick={() => {
        startTransition(handleReviveTasks)
      }}
      className={`${className} btnSecondary bg-lime-600    px-4 sm:hover:bg-lime-500`}
    >
      Revive All
    </button>
  )
}
