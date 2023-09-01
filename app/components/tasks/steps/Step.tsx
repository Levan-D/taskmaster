/** @format */
"use client"

import React from "react"
import ToggleStepComplete from "./ToggleStepComplete"
import RecycleStep from "./RecycleStep"
import StepUpdate from "./StepUpdate"
import { experimental_useOptimistic as useOptimistic } from "react"

type Props = {
  task: Task
  step: Step
  addOptimisticTask: (action: Task[]) => void
}

export default function Step({ task, step, addOptimisticTask }: Props) {
  return (
    <div
      className={`  flex gap-2 items-center group sm:hover:bg-neutral-600 p-2  rounded-md`}
    >
      <ToggleStepComplete addOptimisticTask={addOptimisticTask} task={task} step={step} />
      <StepUpdate
        className="grow truncate line-clamp-1"
        addOptimisticTask={addOptimisticTask}
        task={task}
        step={step}
      />

      <div className={`group-hover:visible invisible `}>
        <RecycleStep addOptimisticTask={addOptimisticTask} task={task} step={step} />
      </div>
    </div>
  )
}
