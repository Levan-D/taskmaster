/** @format */

import React from "react"
import ToggleStepComplete from "./ToggleStepComplete"
import RecycleStep from "./RecycleStep"

export default function Step({ title, id, isComplete }: Step) {
  return (
    <div className="flex gap-2 items-center group sm:hover:bg-neutral-600 p-2  rounded-md">
      <ToggleStepComplete stepId={id} isComplete={isComplete} />
      <p className={`${isComplete && "text-neutral-300 "}   grow `}>{title}</p>
      <div className={`group-hover:visible invisible `}>
        <RecycleStep stepId={id} />
      </div>
    </div>
  )
}
