/** @format */
import React, { useState } from "react"
import Step from "./Step"
import CreateStep from "./CreateStep"
import StepsAccordion from "./StepsAccordion"

type Props = {
  task: Task
  expired: boolean
  addOptimisticTask: (action: Task[]) => void
}

export default function Steps({ task, addOptimisticTask, expired }: Props) {
  const [open, setOpen] = useState(false)

  const totalSteps = task.steps.length
  const amountOfStepsCompleted = task.steps.filter(step => step.complete).length
  const allStepsCompleted = totalSteps === amountOfStepsCompleted && totalSteps > 0

  return (
    <div>
      <div className={` ${open && "is-open"} wrapper !duration-300`}>
        <div className={`${open && " mt-4 "} content`}>
          <div className="flex items-center">
            {totalSteps > 0 ? (
              <>
                <hr className={`mx-4  grow  border-t-[1px] border-neutral-700`} />

                <div
                  className={`${
                    allStepsCompleted ? "text-lime-400   " : "text-neutral-500   "
                  }  p-1.5 text-sm  shrink-0 `}
                >
                  {totalSteps}/{amountOfStepsCompleted}
                </div>

                <hr className={`mx-4  grow  border-t-[1px] border-neutral-700`} />
              </>
            ) : (
              <hr className={`mx-4 my-3 grow  border-t-[1px] border-neutral-700`} />
            )}
          </div>

          {!expired && !task.deleted && (
            <CreateStep
              task={task}
              addOptimisticTask={addOptimisticTask}
              className="my-2"
              totalSteps={totalSteps}
            />
          )}

          {task.steps.length > 0 && (
            <div className="innerContainer m-2 ">
              {task.steps.map(step => (
                <Step
                  addOptimisticTask={addOptimisticTask}
                  expired={expired}
                  key={step.id}
                  task={task}
                  step={step}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <StepsAccordion
        totalSteps={totalSteps}
        amountOfStepsCompleted={amountOfStepsCompleted}
        allStepsCompleted={allStepsCompleted}
        task={task}
        expired={expired}
        open={open}
        setOpen={setOpen}
      />
    </div>
  )
}
