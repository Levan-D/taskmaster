/** @format */
"use client"
import ToggleStepComplete from "./ToggleStepComplete"
import RecycleStep from "./RecycleStep"
import StepUpdate from "./StepUpdate"
import { useState, useEffect } from "react"

type Props = {
  task: Task
  step: Step
  expired: boolean
  addOptimisticTask: (action: Task[]) => void
}

export default function Step({ task, step, addOptimisticTask, expired }: Props) {
  const [animate, setAnimate] = useState(false)

  const isOptimistic = step.id === "optimistic"
  const isBeingDeleted = step.beingDeleted

  useEffect(() => {
    if (isOptimistic) {
      // Start the animation after the initial render
      setTimeout(() => {
        setAnimate(true)
      }, 0)
    }
  }, [])

  return (
    <div
      className={` ${
        isOptimistic && !animate
          ? "optimisticCreateStart"
          : isOptimistic && animate
          ? "optimisticCreateEnd"
          : ""
      }  ${
        isBeingDeleted && "deleteAnimation "
      } flex gap-2 items-center group hover:bg-neutral-600 p-2  rounded-md`}
    >
      <ToggleStepComplete addOptimisticTask={addOptimisticTask} task={task} step={step} />
      <StepUpdate
        className="grow truncate  "
        addOptimisticTask={addOptimisticTask}
        expired={expired}
        task={task}
        step={step}
      />

      <div className={`group-hover:visible sm:invisible `}>
        {!task.deleted && (
          <RecycleStep addOptimisticTask={addOptimisticTask} task={task} step={step} />
        )}
      </div>
    </div>
  )
}
