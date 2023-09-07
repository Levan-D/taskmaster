/** @format */

import Step from "./Step"
import { useState } from "react"
import CreateStep from "./CreateStep"
import Icon from "@mdi/react"
import { mdiChevronDown } from "@mdi/js"
import { DateTime } from "luxon"

type Props = {
  task: Task
  expired: boolean
  addOptimisticTask: (action: Task[]) => void
}

function formatDueDate(due_date: string) {
  const dueDate = DateTime.fromISO(due_date).startOf("day");
  const now = DateTime.now().startOf("day");
  const diffInDays = dueDate.diff(now, "days").days;

  if (dueDate.hasSame(now, "day")) {
    return "Today";
  } else if (dueDate.plus({ days: 1 }).hasSame(now, "day")) {
    return "Yesterday";
  } else if (diffInDays >= 0 && diffInDays <= 6) {
    return dueDate.toFormat("cccc");
  } else if (diffInDays > 6 && diffInDays <= 13) {
    return "Next " + dueDate.toFormat("cccc");
  } else {
    return dueDate.toFormat("dd/MM/yy");
  }
}



export default function Steps({ task, addOptimisticTask, expired }: Props) {
  const [open, setOpen] = useState(task.steps.length > 0 && !task.complete ? true : false)

  const totalSteps = task.steps.length
  const stepsCompleted = task.steps.filter(step => step.complete).length
  const allStepsCompleted = totalSteps === stepsCompleted && totalSteps > 0

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
                  {totalSteps}/{stepsCompleted}
                </div>

                <hr className={`mx-4  grow  border-t-[1px] border-neutral-700`} />
              </>
            ) : (
              <hr className={`mx-4 my-3 grow  border-t-[1px] border-neutral-700`} />
            )}
          </div>

          {!expired && (
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
        disabled={expired && task.steps.length === 0}
        onClick={() => setOpen(x => !x)}
        className={`w-full ${
          (!expired || (expired && task.steps.length > 0)) && "sm:hover:bg-neutral-500"
        } px-2 
    transition-color flex justify-between items-center duration-300 rounded-b-lg  mb-0`}
      >
        <div className="basis-1/3"></div>
        {(!expired || (expired && task.steps.length > 0)) && (
          <Icon
            className={` ${
              open && "rotate-180 "
            } transition-transform basis-1/3 duration-300 mx-auto `}
            path={mdiChevronDown}
            size={1}
          />
        )}

        <div className="basis-1/3  py-1 text-xs text-neutral-300 text-end">
          {typeof task.due_date === "string" && formatDueDate(task.due_date)}
        </div>
      </button>
    </div>
  )
}
