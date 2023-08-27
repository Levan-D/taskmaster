/** @format */
"use client"
import Step from "./Step"

type Props = {
  data: Step[]
}

export default function Steps({ data }: Props) {
  return (
    <div className="innerContainer mx-2 ">
      {data.map(step => (
        <Step key={step.id} {...step} />
      ))}
    </div>
  )
}
