/** @format */

import React, { useState } from "react"
import Step from "./Step"
import CreateStep from "./CreateStep"
import Icon from "@mdi/react"
import { mdiChevronDown } from "@mdi/js"
import { getRelativeDateString } from "@/app/utils/dates"
import Timer from "./Timer"

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
      <button
        disabled={
          ((expired || task.deleted) && task.steps.length === 0) ||
          (!expired && task.deleted && task.steps.length === 0)
        }
        onClick={() => setOpen(x => !x)}
        className={`w-full ${
          (!expired && !task.deleted) ||
          (expired && task.steps.length > 0) ||
          (task.deleted && task.steps.length > 0)
            ? "sm:hover:bg-neutral-500"
            : ""
        } px-2 
        transition-color flex justify-between items-center duration-300 rounded-b-lg  mb-0`}
      >
        <div className="basis-2/5 text-left text-xs text-neutral-300 flex gap-2 ">
          {totalSteps > 0 && (
            <p
              className={`${
                totalSteps === amountOfStepsCompleted && totalSteps > 0 && "text-lime-400"
              }`}
            >
              {totalSteps}/{amountOfStepsCompleted}
            </p>
          )}
          <Timer task={task} />
        </div>
        {((!expired && !task.deleted) ||
          (expired && task.steps.length > 0) ||
          (task.deleted && task.steps.length > 0)) && (
          <Icon
            className={` ${
              open && "rotate-180 "
            } transition-transform basis-1/5 duration-300 mx-auto `}
            path={mdiChevronDown}
            size={1}
          />
        )}

        <div className="basis-2/5  py-1 text-xs text-neutral-300 text-end">
          {typeof task.due_date === "string" && getRelativeDateString(task.due_date)}
        </div>
      </button>
    </div>
  )
}
