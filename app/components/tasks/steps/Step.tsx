/** @format */

import React from "react"
import ToggleStepComplete from "./ToggleStepComplete"
import RecycleStep from "./RecycleStep"
import StepUpdate from "./StepUpdate"

export default function Step({ title, id, isComplete }: Step) {
  return (
    <div className="flex gap-2 items-center group sm:hover:bg-neutral-600 p-2  rounded-md">
      <ToggleStepComplete stepId={id} isComplete={isComplete} />
      <div className="grow truncate line-clamp-1">
        <StepUpdate stepId={id} title={title} isComplete={isComplete} />
      </div>
      <div className={`group-hover:visible invisible `}>
        <RecycleStep stepId={id} />
      </div>
    </div>
  )
}
