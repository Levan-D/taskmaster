/** @format */

import Icon from "@mdi/react"
import { mdiChevronDown, mdiSync } from "@mdi/js"
import { getRelativeDateString } from "@/app/utils/dates"
import Timer from "./Timer"
import { DateTime } from "luxon"
import Tooltip from "../../Tooltip"
import { usePathname } from "next/navigation"
import { useAppSelector } from "@/lib/redux/hooks"

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
  const { windowWidth } = useAppSelector(state => state.global)
  const path = usePathname().split("/")
  const currentPage = path[path.length - 1]

  const today = DateTime.now().toFormat("EEE")
  const isRepeat = task.repeat && task.repeat?.days.length > 0
  const repeatDays = task.repeat && task.repeat?.days.length > 0 && task.repeat.days
  const isTodayRepeat = repeatDays && repeatDays.includes((today as DaysAbr) || "")

  return (
    <button
      aria-label="Toggle step accordion"
      disabled={
        ((expired || task.deleted) && task.steps.length === 0) ||
        (!expired && task.deleted && task.steps.length === 0)
      }
      onClick={() => setOpen(x => !x)}
      className={`w-full ${
        (!expired && !task.deleted) ||
        (expired && task.steps.length > 0) ||
        (task.deleted && task.steps.length > 0)
          ? "hover:bg-neutral-500"
          : ""
      } 
    transition-color flex justify-between items-center duration-300 rounded-b-lg  mb-0`}
    >
      <div className="basis-2/5 text-left text-xs text-neutral-300 items-center flex gap-2 ">
        {totalSteps > 0 && !open && (
          <p className={`${allStepsCompleted && "text-lime-400"} pl-2`}>
            {totalSteps}/{amountOfStepsCompleted}
          </p>
        )}
        {task.start_time && <Timer task={task} totalSteps={totalSteps} open={open} />}
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

      {currentPage !== "habits" && (
        <div className="flex basis-2/5  items-center justify-end  gap-2 pr-2">
          {isRepeat && (
            <Tooltip
              className=" -translate-x-48 text-xs translate-y-2"
              text={`Repeats: ${repeatDays && repeatDays.join(", ")}`}
            >
              <div className="py-1 text-xs text-neutral-300 ">
                <Icon path={mdiSync} size={0.6} />
              </div>
            </Tooltip>
          )}
          {task.due_date && !task.repeat && (
            <Tooltip
              className="-translate-x-24 text-xs translate-y-2"
              text={`Due ${getRelativeDateString(task.due_date)}`}
            >
              <p className="py-1 text-xs text-neutral-300">
                {getRelativeDateString(task.due_date)}
              </p>
            </Tooltip>
          )}
        </div>
      )}

      {currentPage === "habits" && (
        <div className="flex basis-2/5  items-center justify-end  gap-2 pr-2">
          {isRepeat && (
            <Tooltip
              className=" -translate-x-48 text-xs translate-y-2"
              text={`Repeats: ${repeatDays && repeatDays.join(", ")}`}
            >
              {windowWidth > 640 && (
                <p className="py-1 text-xs text-neutral-300 ">
                  {repeatDays && repeatDays.join(", ")}
                </p>
              )}
              {windowWidth <= 640 && (
                <p className="py-1 text-xs text-neutral-300  line-clamp-1    translate-y-[2px] ">
                  {repeatDays && repeatDays.map(day => day.slice(0, 2)).join(", ")}
                </p>
              )}
            </Tooltip>
          )}
        </div>
      )}
    </button>
  )
}
