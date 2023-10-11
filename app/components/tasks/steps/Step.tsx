/** @format */

import ToggleStepComplete from "./ToggleStepComplete"
import RecycleStep from "./RecycleStep"
import StepUpdate from "./StepUpdate"

type Props = {
  task: Task
  step: Step
  expired: boolean
  addOptimisticTask: (action: Task[]) => void
}

export default function Step({ task, step, addOptimisticTask, expired }: Props) {
  return (
    <div
      className={`  flex gap-2 items-center group sm:hover:bg-neutral-600 p-2  rounded-md`}
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
