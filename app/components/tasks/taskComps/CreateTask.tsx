/** @format */

import { useState, useRef } from "react"
import { createTask } from "../../../actions/taskActions"
import Icon from "@mdi/react"
import {
  mdiPlus,
  mdiFlagVariant,
  mdiCalendarTodayOutline,
  mdiCalendarWeekBeginOutline,
  mdiCalendarWeekOutline,
  mdiCalendarMonthOutline,
  mdiLoading,
} from "@mdi/js"
import DropdownMenu from "../../DropdownMenu"
import { toast } from "react-toastify"
import { DateTime } from "luxon"
import { useTransition } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { getOrdinalSuffix } from "@/app/utils/dates"

type Props = {
  taskLimit: number
  addOptimisticTask: (action: Task[]) => void
  defaultPriority: TaskPriority
  defaultDate: Calendar
}

export default function CreateTask({
  taskLimit,
  addOptimisticTask,
  defaultDate,
  defaultPriority,
}: Props) {
  const [priority, setPriority] = useState<TaskPriority>(defaultPriority)
  const [calendar, setCalendar] = useState<Calendar>(defaultDate)
  const [charCount, setCharCount] = useState(0)
  const [focus, setFocus] = useState(false)
  const [startDate, setStartDate] = useState(DateTime.now().plus({ days: 8 }).toJSDate())
  const dropdownRef = useRef<DropdownRefType | null>(null)

  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState("")

  const today = DateTime.now().minus({ day: 0 }).toISO() ?? ""
  const tomorrow = DateTime.now().plus({ day: 1 }).toISO() ?? ""
  const nextWeek = DateTime.now().plus({ day: 7 }).toISO() ?? ""
  const customDate = DateTime.fromJSDate(startDate).toISO() ?? ""

  let priorityClassName = ""
  if (priority === "LOW") {
    priorityClassName = "text-sky-400"
  } else if (priority === "MEDIUM") {
    priorityClassName = "text-amber-400"
  } else {
    priorityClassName = "text-rose-400"
  }

  const priorityButton = (
    <div className={`${priorityClassName} btnSecondary`}>
      <Icon path={mdiFlagVariant} size={1} />
    </div>
  )

  let calendarClassName = ""
  let calendarIconPath = ""
  if (calendar === "Today") {
    calendarClassName = "text-fuchsia-400"
    calendarIconPath = mdiCalendarTodayOutline
  } else if (calendar === "Tomorrow") {
    calendarClassName = "text-lime-400"
    calendarIconPath = mdiCalendarWeekBeginOutline
  } else if (calendar === "Next week") {
    calendarClassName = "text-teal-400"
    calendarIconPath = mdiCalendarWeekOutline
  }

  const calendarButton = (
    <div className={`${calendarClassName} btnSecondary`}>
      {calendar !== "Custom date" ? (
        <Icon path={calendarIconPath} size={1} />
      ) : (
        <div className="w-6 text-sm ">
          {DateTime.fromJSDate(startDate).day}
          <sup>{getOrdinalSuffix(DateTime.fromJSDate(startDate).day)}</sup>
        </div>
      )}
    </div>
  )

  const priorityItems: DropDownItemType = [
    {
      title: "Low",
      icon: <Icon className="text-sky-400" path={mdiFlagVariant} size={0.7} />,
      action: () => setPriority("LOW"),
    },
    {
      title: "Medium",
      icon: <Icon className="text-amber-400" path={mdiFlagVariant} size={0.7} />,
      action: () => setPriority("MEDIUM"),
    },
    {
      title: "High",
      icon: <Icon className="text-rose-400" path={mdiFlagVariant} size={0.7} />,
      action: () => setPriority("HIGH"),
    },
  ]

  const calendarItems: DropDownItemType = [
    {
      title: "Today",
      icon: (
        <Icon className="text-fuchsia-400" path={mdiCalendarTodayOutline} size={0.7} />
      ),
      action: () => setCalendar("Today"),
    },
    {
      title: "Tomorrow",
      icon: (
        <Icon className="text-lime-400" path={mdiCalendarWeekBeginOutline} size={0.7} />
      ),
      action: () => setCalendar("Tomorrow"),
    },
    {
      title: "Next Week",
      icon: <Icon className="text-teal-400" path={mdiCalendarWeekOutline} size={0.7} />,
      action: () => setCalendar("Next week"),
    },
    {
      JSX: (
        <DatePicker
          onInputClick={() => setCalendar("Custom date")}
          wrapperClassName="datePicker"
          customInput={
            <div className="flex gap-2 hover:bg-neutral-600 text-sm pl-4 pr-8 items-center cursor-pointer py-1.5 whitespace-nowrap rounded-md  text active:bg-neutral-700 duration-300 text-left w-full">
              <Icon className="text-blue-400" path={mdiCalendarMonthOutline} size={0.7} />
              <p>Custom Date</p>
            </div>
          }
          minDate={DateTime.now().plus({ days: 8 }).toJSDate()}
          selected={startDate}
          onChange={date => {
            if (date) setStartDate(date)
            if (dropdownRef.current) dropdownRef.current.closeDropdown()
          }}
        />
      ),
    },
  ]

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let dueDate = ""

    if (calendar === "Today") {
      dueDate = today
    } else if (calendar === "Tomorrow") {
      dueDate = tomorrow
    } else if (calendar === "Next week") {
      dueDate = nextWeek
    } else if (calendar === "Custom date") {
      dueDate = customDate
    }

    const handleCreateTask = async () => {
      await createTask({ title: title, priority: priority, dueDate: dueDate })
    }

    if (taskLimit > 19) {
      return toast.warning(
        <div className="text-neutral-950">
          Complete some of your current tasks before adding new ones
        </div>,
        {
          toastId: "taskLimit",
        }
      )
    }
    const newTask: Task = {
      id: "optimistic",
      title: title,
      deleted: false,
      complete: false,
      start_time: null,
      end_time: null,
      creation_date: DateTime.now().toJSDate(),
      due_date: dueDate,
      priority: priority,
      user_id: "optimistic",
      steps: [],
    }

    addOptimisticTask([newTask])
    startTransition(handleCreateTask)
    setTitle("")
    setPriority(defaultPriority)
    setCalendar(defaultDate)
    setCharCount(0)
  }

  return (
    <div className="   p-2 mainContainer  hover:border-neutral-600 transition-colors duration-300">
      <form onSubmit={submitForm} className="relative">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            placeholder="Create a task"
            className="input p-4  w-full grow  text-sm sm:text-lg"
            name="title"
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={title}
            maxLength={190}
            onChange={e => {
              setCharCount(e.target.value.length)
              setTitle(e.target.value)
            }}
            type="text"
            required
          />
          <p
            className={`${
              charCount === 190 && "!text-neutral-200"
            } text-xs text-neutral-400 absolute right-2 top-9 sm:right-32 sm:top-[50px] z-30`}
          >
            {focus && `${charCount}/190`}
          </p>

          <div className="flex flex-row  gap-2">
            <div className="flex flex-row sm:flex-col gap-2">
              <DropdownMenu
                menuClassName="sm:-translate-x-32  "
                button={calendarButton}
                items={calendarItems}
                ref={dropdownRef}
              />

              <DropdownMenu
                menuClassName="sm:-translate-x-24   "
                button={priorityButton}
                items={priorityItems}
              />
            </div>

            <div className="grow ">
              <button
                disabled={isPending}
                className={`${isPending && "opacity-75"} btnPrimary px-6 h-full w-full  ${
                  charCount === 0 && "cursor-not-allowed"
                }`}
              >
                <Icon
                  path={isPending ? mdiLoading : mdiPlus}
                  className="mx-auto  sm:scale-125"
                  size={1}
                  spin={isPending}
                />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
