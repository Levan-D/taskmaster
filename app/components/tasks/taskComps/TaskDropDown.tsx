/** @format */
"use client"

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
import { useState, useTransition } from "react"
import { DateTime } from "luxon"
import Tooltip from "../../Tooltip"
import { useAppSelector } from "@/lib/redux/hooks"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useRef } from "react"

import Modal from "../../modal/Modal"
import Habit from "../../modal/Habit"
import Timer from "../../modal/Timer"

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
  const { windowWidth } = useAppSelector(state => state.global)
  const [isPending, startTransition] = useTransition()
  const [isHabitOpen, setIsHabitOpen] = useState(false)
  const [isTimerOpen, setIsTimerOpen] = useState(false)

  const today = DateTime.now().minus({ day: 0 })

  const tomorrow = DateTime.now().plus({ day: 1 })
  const nextWeek = DateTime.now().plus({ day: 7 })

  const dropdownRef = useRef<DropdownRefType | null>(null)

  const handleCloseHabitModal = () => {
    setIsHabitOpen(false)
  }
  const handleCloseTimerModal = () => {
    setIsTimerOpen(false)
  }

  const handleRecycleTask = () => {
    startTransition(async () => {
      addOptimisticTask([{ ...task, beingDeleted: true }])

      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        addOptimisticTask([
          { ...task, deleted: true, complete: false, beingDeleted: false },
        ])
        await recycleTask({ taskId: task.id })
      } catch (error) {
        console.error("Failed to toggle task completion:", error)
      }
    })
  }

  const handleReviveTask = ({ date = today }: { date?: DateTime }) => {
    startTransition(async () => {
      try {
        addOptimisticTask([{ ...task, due_date: date.toJSDate(), deleted: false }])
        await reviveTask({ taskId: task.id, dueDate: date.toJSDate() })
      } catch (error) {
        console.error("Failed to revive task:", error)
      }
    })
  }

  const handleChangeTaskPriority = (priority: TaskPriority) => {
    startTransition(async () => {
      try {
        addOptimisticTask([{ ...task, priority: priority }])
        await updateTask({ taskId: task.id, priority: priority, title: task.title })
      } catch (error) {
        console.error("Failed to change task priority:", error)
      }
    })
  }

  const items: DropDownItemType = [
    {
      JSX: (
        <div className="px-4 py-1.5 text-sm">
          <p className="text-neutral-200  text-xs">{task.deleted ? "Revive" : "Date"}</p>
          <div className="flex  ">
            <Tooltip className="delay-500" text="Today">
              <button
                aria-label="Move tasks due date to today"
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
                aria-label="Move tasks due date to tomorrow"
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
                aria-label="Move tasks due date to the end of the week"
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
                aria-label="Change priority to low"
                onClick={() => {
                  handleChangeTaskPriority("LOW")

                  if (dropdownRef.current) dropdownRef.current.closeDropdown()
                }}
                className="btnIcon p-1.5"
              >
                <Icon className="text-indigo-400" path={mdiFlagVariant} size={0.7} />
              </button>
            </Tooltip>
            <Tooltip className="delay-500" text="Medium">
              <button
                aria-label="Change priority to medium"
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
                aria-label="Change priority to high"
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
      action: () => setIsTimerOpen(() => true),
      invisible: expired || task.deleted || task.complete ? true : false,
    },
    {
      title: task.repeat && task.repeat.days.length > 0 ? "Edit habit" : "Create habit",
      icon: <Icon path={mdiSync} size={0.7} />,
      action: () => setIsHabitOpen(() => true),
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
    <>
      {(windowWidth <= 640 || (windowWidth > 640 && visible)) && (
        <div className="flex ">
          {((expired && !task.complete) || task.deleted) && (
            <Tooltip text="Revive for today" className="delay-500">
              <button
                aria-label="Revive task and add it to today"
                disabled={isPending}
                onClick={() => handleReviveTask({})}
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
                aria-label="Recycle task"
                disabled={isPending}
                onClick={handleRecycleTask}
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
              <Icon
                path={mdiDotsVertical}
                size={1}
                className="  scale-75 sm:scale-100 "
              />
            </div>
          </DropdownMenu>
        </div>
      )}

      <Modal
        isOpen={isHabitOpen}
        handleClose={handleCloseHabitModal}
        icon={mdiSync}
        title="Habit"
        domNodeId="habit-modal"
      >
        {
          <Habit
            handleClose={handleCloseHabitModal}
            task={task}
            addOptimisticTask={addOptimisticTask}
          />
        }
      </Modal>

      <Modal
        isOpen={isTimerOpen}
        handleClose={handleCloseTimerModal}
        icon={mdiTimerOutline}
        title="Set timer"
        domNodeId="timer-modal"
      >
        {
          <Timer
            handleClose={handleCloseTimerModal}
            task={task}
            addOptimisticTask={addOptimisticTask}
          />
        }
      </Modal>
    </>
  )
}
