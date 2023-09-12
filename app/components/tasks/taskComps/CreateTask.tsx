/** @format */

import { useState } from "react"
import { createTask } from "../../../actions/taskActions"
import Icon from "@mdi/react"
import {
  mdiPlus,
  mdiTimerAlertOutline,
  mdiCalendarTodayOutline,
  mdiCalendarWeekBeginOutline,
  mdiCalendarWeekOutline,
} from "@mdi/js"
import DropdownMenu from "../../DropdownMenu"
import { toast } from "react-toastify"
import { DateTime } from "luxon"
import { useTransition } from "react"

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

  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState("")

  const today = DateTime.now().minus({ day:0 }).toISO() ?? ""
  const tomorrow = DateTime.now().plus({ day: 1 }).toISO() ?? ""
  const nextWeek = DateTime.now().plus({ day: 7 }).toISO() ?? ""

  const priorityButton = (
    <div
      className={`${
        priority === "LOW"
          ? "text-sky-400"
          : priority === "MEDIUM"
          ? "text-amber-400"
          : "text-rose-400"
      } btnSecondary`}
    >
      <Icon path={mdiTimerAlertOutline} size={1} />
    </div>
  )

  const calendarButton = (
    <div
      className={`${
        calendar === "Today"
          ? "text-fuchsia-400"
          : calendar === "Tomorrow"
          ? "text-lime-400"
          : "text-teal-400"
      } btnSecondary`}
    >
      <Icon
        path={
          calendar === "Today"
            ? mdiCalendarTodayOutline
            : calendar === "Tomorrow"
            ? mdiCalendarWeekBeginOutline
            : mdiCalendarWeekOutline
        }
        size={1}
      />
    </div>
  )

  const priorityItems: DropDownItemType = [
    {
      title: "Low",
      icon: <Icon className="text-sky-400" path={mdiTimerAlertOutline} size={0.7} />,
      action: () => setPriority("LOW"),
    },
    {
      title: "Medium",
      icon: <Icon className="text-amber-400" path={mdiTimerAlertOutline} size={0.7} />,
      action: () => setPriority("MEDIUM"),
    },
    {
      title: "High",
      icon: <Icon className="text-rose-400" path={mdiTimerAlertOutline} size={0.7} />,
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
  ]

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const dueDate =
      calendar === "Today" ? today : calendar === "Tomorrow" ? tomorrow : nextWeek

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
  }

  return (
    <div className="   p-2 mainContainer w-full sm:hover:border-neutral-600 transition-colors duration-300">
      <form onSubmit={submitForm}>
        <div className="flex gap-2">
          <input
            placeholder="Create a task"
            className="input p-4 text-lg grow"
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            type="text"
            required
          />
          <div className="flex flex-col gap-2">
            <DropdownMenu button={calendarButton} items={calendarItems} />

            <DropdownMenu button={priorityButton} items={priorityItems} />
          </div>

          <div>
            <button className="btnPrimary px-5 h-full">
              <Icon path={mdiPlus} size={1.4} />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
