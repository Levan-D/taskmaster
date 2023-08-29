/** @format */
"use client"
import Step from "./Step"

type Props = {
  steps: Step[]
}

export default function Steps({ steps }: Props) {
  return (
    <div className="innerContainer mx-2 ">
      {steps.map(step => (
        <Step key={step.id} {...step} />
      ))}
    </div>
  )
}
