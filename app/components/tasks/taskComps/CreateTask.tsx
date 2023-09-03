/** @format */

import { useState } from "react"
import { createTask } from "../../../actions"
import Icon from "@mdi/react"
import { mdiPlus, mdiTimerAlertOutline, mdiCalendarClockOutline } from "@mdi/js"
import DropdownMenu from "../../DropdownMenu"
import Tooltip from "../../Tooltip"
import { toast } from "react-toastify"
import { DateTime } from "luxon"
import { useTransition } from "react"

type Props = { totalTasks: number; addOptimisticTask: (action: Task[]) => void }

export default function CreateTask({ totalTasks, addOptimisticTask }: Props) {
  const [priority, setPriority] = useState<TaskPriority>("LOW")
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState("")

  const today = DateTime.now().toISO() ?? ""

  const priorityButton = (
    <Tooltip text="Task priority" position="bot" className="delay-1000">
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
    </Tooltip>
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

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const handleCreateTask = async () => {
      await createTask({ title: title, priority: priority, today: today })
    }

    if (totalTasks > 19) {
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
      id: "000",
      title: title,
      deleted: false,
      complete: false,
      creation_date: DateTime.now().toJSDate(),
      due_date: today,
      priority: priority,
      user_id: "000",
      steps: [],
    }

    addOptimisticTask([newTask])
    startTransition(handleCreateTask)
    setTitle("")
    setPriority("LOW")
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
            <div className="btnSecondary">
              <Icon path={mdiCalendarClockOutline} size={1} />
            </div>

            <DropdownMenu button={priorityButton} items={priorityItems} />
          </div>

          <Tooltip text="Create new task" position="bot" className="delay-1000">
            <button className="btnPrimary px-5 h-full">
              <Icon path={mdiPlus} size={1.4} />
            </button>
          </Tooltip>
        </div>
      </form>
    </div>
  )
}
