/** @format */
"use client"

import React from "react"
import ToggleStepComplete from "./ToggleStepComplete"
import RecycleStep from "./RecycleStep"
import StepUpdate from "./StepUpdate"
import { experimental_useOptimistic as useOptimistic } from "react"

export default function Step({ title, id, complete, deleted }: Step) {
  const [optimisticComplete, addOptimisticComplete] = useOptimistic(
    complete,
    (state, newComplete: boolean) => {
      return newComplete
    }
  )

  const [optimisticDelete, addOptimisticDelete] = useOptimistic(
    deleted,
    (state, newDelete: boolean) => {
      return newDelete
    }
  )

  const [optimisticTitle, addOptimisticTitle] = useOptimistic(
    title,
    (state, newTitle: string) => {
      return newTitle
    }
  )

  return (
    <div
      className={` ${
        optimisticDelete && "hidden"
      } flex gap-2 items-center group sm:hover:bg-neutral-600 p-2  rounded-md`}
    >
      <ToggleStepComplete
        addOptimisticComplete={addOptimisticComplete}
        optimisticComplete={optimisticComplete}
        stepId={id}
        complete={complete}
      />
      <StepUpdate
        className="grow truncate line-clamp-1"
        title={title}
        addOptimisticTitle={addOptimisticTitle}
        optimisticTitle={optimisticTitle}
        stepId={id}
        complete={complete}
      />

      <div className={`group-hover:visible invisible `}>
        <RecycleStep addOptimisticDelete={addOptimisticDelete} stepId={id} />
      </div>
    </div>
  )
}
