/** @format */
"use client"
import Step from "./Step"
import { useState } from "react"
import CreateStep from "./CreateStep"
import Icon from "@mdi/react"
import { mdiChevronDown, mdiCheck } from "@mdi/js"

type Props = {
  taskId: string
  steps: Step[] | undefined
  taskIsComplete: boolean
}

export default function Steps({ taskId, steps, taskIsComplete }: Props) {
  const [isOpen, setIsOpen] = useState(
    steps && steps.length > 0 && !taskIsComplete ? true : false
  )

  if (!steps) return <span></span>

  const totalSteps = steps.length
  const stepsCompleted = steps.filter(step => step.isComplete).length

  const completeTasks = totalSteps === stepsCompleted && totalSteps > 0

  return (
    <>
      <div className={`${isOpen ? " visible   mt-4" : "collapse h-0 "} `}>
        <div className="flex items-center">
          {totalSteps > 0 ? (
            <>
              <hr className={`mx-4  grow  border-t-[1px] border-neutral-700`} />

              <div
                className={`${
                  completeTasks ? "text-lime-400   " : "text-neutral-500   "
                }  p-1.5 text-sm  shrink-0 `}
              >
                {totalSteps}/{stepsCompleted}
              </div>

              <hr className={`mx-4  grow  border-t-[1px] border-neutral-700`} />
            </>
          ) : (
            <hr className={`mx-4 my-3 grow  border-t-[1px] border-neutral-700`} />
          )}
        </div>

        <div className="my-2">
          <CreateStep taskId={taskId} />
        </div>
        {steps && steps.length > 0 && (
          <div className="innerContainer m-2 ">
            {steps.map(step => (
              <Step key={step.id} {...step} />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setIsOpen(x => !x)}
        className={`w-full sm:hover:bg-neutral-500 px-2 transition-color duration-300 rounded-b-lg`}
      >
        <Icon
          className={` ${
            isOpen && "rotate-180 "
          } transition-transform duration-300 mx-auto `}
          path={mdiChevronDown}
          size={1}
        />
      </button>
    </>
  )
}
