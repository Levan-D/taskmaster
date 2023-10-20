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
  totalSteps: number
  amountOfStepsCompleted: number
  allStepsCompleted: boolean
}

export default function StepsAccordion({
  task,
  expired,
  setOpen,
  open,
  totalSteps,
  amountOfStepsCompleted,
  allStepsCompleted,
}: Props) {
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
      } 
    transition-color flex justify-between items-center duration-300 rounded-b-lg  mb-0`}
    >
      <div className="basis-2/5 text-left text-xs text-neutral-300 flex gap-2 ">
        {totalSteps > 0 && (
          <p className={`${allStepsCompleted && "text-lime-400"} pl-2`}>
            {totalSteps}/{amountOfStepsCompleted}
          </p>
        )}
        {task.start_time && (
          <div className={`${totalSteps === 0 && "pl-1"}`}>
            <Timer task={task} />
          </div>
        )}
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

      <div className="basis-2/5 pr-2 py-1 text-xs text-neutral-300 text-end">
        {typeof task.due_date === "string" && getRelativeDateString(task.due_date)}
      </div>
    </button>
  )
}
