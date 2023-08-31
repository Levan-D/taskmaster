/** @format */

import React from "react"
import ToggleStepComplete from "./ToggleStepComplete"
import RecycleStep from "./RecycleStep"
import StepUpdate from "./StepUpdate"

export default function Step({ title, id, complete }: Step) {
  return (
    <div className="flex gap-2 items-center group sm:hover:bg-neutral-600 p-2  rounded-md">
      <ToggleStepComplete stepId={id} complete={complete} />
         <StepUpdate className="grow truncate line-clamp-1" stepId={id} title={title} complete={complete} />
      
      <div className={`group-hover:visible invisible `}>
        <RecycleStep stepId={id} />
      </div>
    </div>
  )
}
