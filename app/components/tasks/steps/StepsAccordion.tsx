/** @format */

import Icon from "@mdi/react"
import { mdiChevronDown } from "@mdi/js"
import { getRelativeDateString } from "@/app/utils/dates"
import Timer from "./Timer"

type Props = {
  task: Task
  expired: boolean
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function StepsAccordion({ task, expired, setOpen, open }: Props) {
  const totalSteps = task.steps.length
  const amountOfStepsCompleted = task.steps.filter(step => step.complete).length
  const allStepsCompleted = totalSteps === amountOfStepsCompleted && totalSteps > 0

  return (
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
  )
}
