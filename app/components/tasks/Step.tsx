/** @format */

import React from "react"
import ToggleStepComplete from "./ToggleStepComplete"
import RecycleStep from "./RecycleStep"

type Props = {
  id: string
  title: string
  state: boolean
  creationDate: Date
  taskId: string
}

export default function Step({ title, id, state }: Props) {
  return (
    <div className="flex gap-2 items-center">
      <ToggleStepComplete stepId={id} state={state} />
      <p>{title}</p>
      <RecycleStep stepId={id} />
    </div>
  )
}
