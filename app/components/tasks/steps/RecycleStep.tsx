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
    const updatedStep = { ...step, deleted: true }
    const updatedTasks = updateStepInTask(task, updatedStep)

    addOptimisticTask([updatedTasks])

    await recycleStep({ stepId: step.id })
  }

  return (
    <button
      disabled={isPending}
      className="btnError"
      onClick={() => {
        startTransition(handleRecycleStep)
      }}
    >
      <Icon path={mdiTrashCanOutline} size={0.8} />
    </button>
  )
}
