/** @format */

import Icon from "@mdi/react"
import {
  mdiDotsVertical,
  mdiTrashCanOutline,
  mdiHeartOutline,
  mdiFlagVariant,
  mdiCalendarTodayOutline,
  mdiCalendarWeekBeginOutline,
  mdiCalendarWeekOutline,
  mdiCalendarMonthOutline,
  mdiTimerOutline,
  mdiSync,
} from "@mdi/js"
import DropdownMenu from "../../DropdownMenu"
import { recycleTask, reviveTask, updateTask } from "../../../actions/taskActions"
import { useTransition } from "react"
import { DateTime } from "luxon"
import Tooltip from "../../Tooltip"
import { useAppSelector } from "@/lib/redux/hooks"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useRef } from "react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setModal } from "@/lib/redux/slices/globalSlice"

type Props = {
  task: Task
  expired: boolean
  visible: boolean
  addOptimisticTask: (action: Task[]) => void
}

export default function TaskDropDown({
  task,
  expired,
  visible,
  addOptimisticTask,
}: Props) {
  const dispatch = useAppDispatch()
  const { windowWidth } = useAppSelector(state => state.global)
  const [isPending, startTransition] = useTransition()

  const today = DateTime.now().minus({ day: 0 })

  const tomorrow = DateTime.now().plus({ day: 1 })
  const nextWeek = DateTime.now().plus({ day: 7 })

  const dropdownRef = useRef<DropdownRefType | null>(null)

  const handleRecycleTask = async () => {
    startTransition(() => {
      addOptimisticTask([{ ...task, beingDeleted: true }])

      setTimeout(async () => {
        addOptimisticTask([
          { ...task, deleted: true, complete: false, beingDeleted: false },
        ])
        await recycleTask({ taskId: task.id })
      }, 300)
    })
  }

  const handleReviveTask = async ({ date = today }: { date?: DateTime }) => {
    addOptimisticTask([{ ...task, due_date: date, deleted: false }])

    await reviveTask({ taskId: task.id, dueDate: date.toJSDate() })
  }

  const handleChangeTaskPriority = async (priority: TaskPriority) => {
    addOptimisticTask([{ ...task, priority: priority }])

    await updateTask({ taskId: task.id, priority: priority, title: task.title })
  }

  const stringifyDates = (task: Task): TaskStringed => {
    let newTask = { ...task, steps: [] }

    for (const key in newTask) {
      if (newTask[key as keyof Task] instanceof Date) {
        newTask = {
          ...newTask,
          [key as keyof Task]: newTask[key as keyof Task].toISOString(),
        }
      }
    }

    return newTask
  }

  const items: DropDownItemType = [
    {
      JSX: (
        <div className="px-4 py-1.5 text-sm">
          <p className="text-neutral-200  text-xs">{task.deleted ? "Revive" : "Date"}</p>
          <div className="flex  ">
            <Tooltip className="delay-500" text="Today">
              <button
                onClick={() => {
                  handleReviveTask({})
                  if (dropdownRef.current) dropdownRef.current.closeDropdown()
                }}
                className="btnIcon p-1.5"
              >
                <Icon
                  className="text-fuchsia-400"
                  path={mdiCalendarTodayOutline}
                  size={0.7}
                />
              </button>
            </Tooltip>
            <Tooltip className="delay-500" text="Tomorrow">
              <button
                onClick={() => {
                  handleReviveTask({ date: tomorrow })
                  if (dropdownRef.current) dropdownRef.current.closeDropdown()
                }}
                className="btnIcon p-1.5"
              >
                <Icon
                  className="text-lime-400"
                  path={mdiCalendarWeekBeginOutline}
                  size={0.7}
                />
              </button>
            </Tooltip>
            <Tooltip className="delay-500" text="Week">
              <button
                onClick={() => {
                  handleReviveTask({ date: nextWeek })
                  if (dropdownRef.current) dropdownRef.current.closeDropdown()
                }}
                className="btnIcon p-1.5"
              >
                <Icon
                  className="text-teal-400"
                  path={mdiCalendarWeekOutline}
                  size={0.7}
                />
              </button>
            </Tooltip>
            <Tooltip className="delay-500" text="Custom">
              <div className="btnIcon   cursor-pointer">
                <DatePicker
                  wrapperClassName="datePicker"
                  customInput={
                    <div className="p-1.5">
                      <Icon
                        className="text-blue-400"
                        path={mdiCalendarMonthOutline}
                        size={0.7}
                      />
                    </div>
                  }
                  minDate={new Date()}
                  onChange={date => {
                    if (date)
                      handleReviveTask({
                        date: DateTime.fromJSDate(date),
                      })
                    if (dropdownRef.current) dropdownRef.current.closeDropdown()
                  }}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      ),
    },
    { break: task.deleted ? false : true },
    {
      invisible: expired || task.deleted ? true : false,
      JSX: (
        <div className="px-4 py-1.5 text-sm">
          <p className="text-neutral-200  text-xs">Priority</p>
          <div className="flex  ">
            <Tooltip className="delay-500" text="Low">
              <button
                onClick={() => {
                  handleChangeTaskPriority("LOW")

                  if (dropdownRef.current) dropdownRef.current.closeDropdown()
                }}
                className="btnIcon p-1.5"
              >
                <Icon className="text-sky-400" path={mdiFlagVariant} size={0.7} />
              </button>
            </Tooltip>
            <Tooltip className="delay-500" text="Medium">
              <button
                onClick={() => {
                  handleChangeTaskPriority("MEDIUM")

                  if (dropdownRef.current) dropdownRef.current.closeDropdown()
                }}
                className="btnIcon p-1.5"
              >
                <Icon className="text-amber-400" path={mdiFlagVariant} size={0.7} />
              </button>
            </Tooltip>
            <Tooltip className="delay-500" text="High">
              <button
                onClick={() => {
                  handleChangeTaskPriority("HIGH")

                  if (dropdownRef.current) dropdownRef.current.closeDropdown()
                }}
                className="btnIcon p-1.5"
              >
                <Icon className="text-rose-400" path={mdiFlagVariant} size={0.7} />
              </button>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      break: expired || task.deleted ? false : true,
    },
    {
      title: !task.start_time ? "Enable timer" : "Edit timer",
      icon: <Icon path={mdiTimerOutline} size={0.7} />,
      action: () =>
        dispatch(
          setModal({
            open: true,
            type: "timer",
            selectedTask: stringifyDates(task),
          })
        ),
      invisible: expired || task.deleted || task.complete ? true : false,
    },
    {
      title: task.repeat && task.repeat.days.length > 0 ? "Edit habit" : "Create habit",
      icon: <Icon path={mdiSync} size={0.7} />,
      action: () =>
        dispatch(
          setModal({
            open: true,
            type: "habit",
            selectedTask: stringifyDates(task),
          })
        ),
      invisible: expired || task.deleted || task.complete ? true : false,
    },
    {
      break: expired || task.deleted || task.complete ? false : true,
    },
    {
      title: "Recycle",
      invisible: task.deleted,
      icon: <Icon path={mdiTrashCanOutline} size={0.7} />,
      action: () => handleRecycleTask(),
    },
  ]

  return (
    (windowWidth <= 640 || (windowWidth > 640 && visible)) && (
      <div className="flex ">
        {((expired && !task.complete) || task.deleted) && (
          <Tooltip text="Revive for today" className="delay-500">
            <button
              disabled={isPending}
              onClick={() => {
                startTransition(() => handleReviveTask({}))
              }}
              className="p-1 sm:p-2 block bg-lime-600 shadow-sm hover:bg-lime-500 rounded-bl-lg duration-300"
            >
              <Icon
                className="  scale-75 sm:scale-100 "
                path={mdiHeartOutline}
                size={1}
              />
            </button>
          </Tooltip>
        )}
        {task.complete && !task.deleted && (
          <Tooltip text="Recycle" className="delay-500">
            <button
              disabled={isPending}
              onClick={() => {
                startTransition(handleRecycleTask)
              }}
              className={`block bg-neutral-600 shadow-sm hover:bg-neutral-500 border-r-[2px]  border-neutral-700    rounded-bl-lg p-1 sm:p-2 duration-300 `}
            >
              <Icon
                className="  scale-75 sm:scale-100 "
                path={mdiTrashCanOutline}
                size={1}
              />
            </button>
          </Tooltip>
        )}
        <DropdownMenu
          ref={dropdownRef}
          menuClassName="-translate-x-[116px]  "
          items={items}
        >
          <div
            className={`${
              expired || (task.complete && !task.deleted) || task.deleted
                ? `bg-neutral-600 shadow-sm hover:bg-neutral-500`
                : "rounded-bl-lg"
            } hover:bg-neutral-600 rounded-tr-lg p-1 sm:p-2   duration-300`}
          >
            <Icon path={mdiDotsVertical} size={1} className="  scale-75 sm:scale-100 " />
          </div>
        </DropdownMenu>
      </div>
    )
  )
}
