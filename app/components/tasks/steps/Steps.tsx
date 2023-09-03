/** @format */

import Step from "./Step"
import { useState } from "react"
import CreateStep from "./CreateStep"
import Icon from "@mdi/react"
import { mdiChevronDown } from "@mdi/js"
import { DateTime } from "luxon"

type Props = {
  task: Task
  addOptimisticTask: (action: Task[]) => void
}

export default function Steps({ task, addOptimisticTask }: Props) {
  const [open, setOpen] = useState(task.steps.length > 0 && !task.complete ? true : false)

  const totalSteps = task.steps.length
  const stepsCompleted = task.steps.filter(step => step.complete).length
  const allStepsCompleted = totalSteps === stepsCompleted && totalSteps > 0

  function formatDueDate(due_date: string) {
    const dueDate = DateTime.fromISO(due_date).startOf("day")
    const now = DateTime.now().startOf("day")

    if (dueDate.hasSame(now, "day")) {
      return "Today"
    } else if (dueDate.plus({ days: 1 }).hasSame(now, "day")) {
      return "Yesterday"
    } else if (
      dueDate.diff(now, "days").days <= 6 &&
      dueDate.diff(now, "days").days >= -6
    ) {
      return dueDate.toFormat("cccc")
    } else {
      return dueDate.toFormat("dd/MM/yy")
    }
  }

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

          <CreateStep className="my-2" totalSteps={totalSteps} taskId={task.id} />

          {task.steps.length > 0 && (
            <div className="innerContainer m-2 ">
              {task.steps.map(step => (
                <Step
                  addOptimisticTask={addOptimisticTask}
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
        onClick={() => setOpen(x => !x)}
        className={`w-full sm:hover:bg-neutral-500 px-2 
    transition-color flex justify-between items-center duration-300 rounded-b-lg  mb-0`}
      >
        <div className="basis-1/3"></div>
        <Icon
          className={` ${
            open && "rotate-180 "
          } transition-transform basis-1/3 duration-300 mx-auto `}
          path={mdiChevronDown}
          size={1}
        />
        <div className="basis-1/3 text-xs text-neutral-300 text-end">
          {typeof task.due_date === "string" && formatDueDate(task.due_date)}
        </div>
      </button>
    </div>
  )
}
