/** @format */
"use client"
import { toggleStepComplete } from "@/app/actions/stepActions"
import { useTransition } from "react"
import Icon from "@mdi/react"
import { mdiCheckBold, mdiCheckOutline } from "@mdi/js"
import { useState } from "react"

type Props = {
  task: Task
  step: Step
  addOptimisticTask: (action: Task[]) => void
}

const updateStepInTask = (task: Task, updatedStep: Step): Task => {
  const stepIndex = task.steps.findIndex(step => step.id === updatedStep.id)

  if (stepIndex !== -1) {
    const newSteps = [...task.steps]
    newSteps[stepIndex] = updatedStep

    const updatedTask = { ...task, steps: newSteps }

    return updatedTask
  }

  return task
}

export default function ToggleStepComplete({ task, step, addOptimisticTask }: Props) {
  const [isPending, startTransition] = useTransition()
  const [hovering, setHovering] = useState(false)

  const handleToggleStepComplete = async () => {
    const updatedStep = { ...step, complete: !step.complete }
    const updatedTasks = updateStepInTask(task, updatedStep)

    addOptimisticTask([updatedTasks])
    await toggleStepComplete({ stepId: step.id, complete: !step.complete })
  }

  return (
    <button
      disabled={isPending || task.deleted}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={` ${
        step.complete
          ? "bg-lime-600 md:hover:bg-lime-500"
          : "bg-neutral-900 md:hover:bg-neutral-800"
      } block  rounded-md   p-1 duration-300 transition-colors `}
      onClick={() => {
        startTransition(handleToggleStepComplete)
      }}
    >
      <Icon
        path={step.complete || hovering ? mdiCheckBold : mdiCheckOutline}
        className={`${step.complete ? "text-white" : "text-neutral-300"} `}
        size={0.8}
      />
    </button>
  )
}
