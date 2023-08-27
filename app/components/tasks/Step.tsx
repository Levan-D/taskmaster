/** @format */

import React from "react"
import ToggleStepComplete from "./ToggleStepComplete"
import RecycleStep from "./RecycleStep"

export default function Step({ title, id, state }: Step) {
  return (
    <div className="flex gap-2 items-center">
      <ToggleStepComplete stepId={id} state={state} />
      <p>{title}</p>
      <RecycleStep stepId={id} />
    </div>
  )
}
