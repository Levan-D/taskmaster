/** @format */

import { recycleStep } from "../../../actions/stepActions"
import { useTransition } from "react"
import Icon from "@mdi/react"
import { mdiTrashCanOutline } from "@mdi/js"

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

export default function RecycleStep({ task, step, addOptimisticTask }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleRecycleStep = async () => {
    const updatedStep = { ...step, beingDeleted: true }
    const updatedTasks = updateStepInTask(task, updatedStep)

    startTransition(async () => {
      addOptimisticTask([updatedTasks])
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        const updatedStep = { ...step, deleted: true, beingDeleted: false }
        const updatedTasks = updateStepInTask(task, updatedStep)

        addOptimisticTask([updatedTasks])

        await recycleStep({ stepId: step.id })
      } catch (error) {
        console.error("Failed to recycle step:", error)
      }
    })
  }

  return (
    <button
      aria-label="Recycle step"
      disabled={isPending}
      className="btnSecondary"
      onClick={handleRecycleStep}
    >
      <Icon path={mdiTrashCanOutline} size={0.8} />
    </button>
  )
}
