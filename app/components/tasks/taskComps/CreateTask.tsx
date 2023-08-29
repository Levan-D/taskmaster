/** @format */
"use client"

import { useState } from "react"
import { createTask } from "../../../actions"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import Icon from "@mdi/react"
import { mdiPlus, mdiTimerAlertOutline, mdiCalendarClockOutline } from "@mdi/js"
import DropdownMenu from "../../DropdownMenu"

export default function CreateTask() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [priority, setPriority] = useState<TaskPriority>("LOW")

  const priorityButton = (
    <div
      className={`${
        priority === "LOW"
          ? "text-lime-400"
          : priority === "MEDIUM"
          ? "text-amber-400"
          : "text-rose-400"
      } btnSecondary`}
    >
      <Icon path={mdiTimerAlertOutline} size={1} />
    </div>
  )

  const priorityItems: DropDownItemType = [
    {
      title: "Low",
      icon: <Icon className="text-lime-400" path={mdiTimerAlertOutline} size={0.7} />,
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

  const submitForm = (data: FormData) => {
    createTask(data, priority)
    router.refresh()
    setPriority("LOW")
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  return (
    <div className="   p-2 mainContainer w-full sm:hover:border-neutral-600 transition-colors duration-300">
      <form ref={formRef} action={submitForm}>
        <div className="flex gap-2">
          <input
            placeholder="Create a task"
            className="input p-4 text-lg grow"
            name="title"
            type="text"
            required
          />
          <div className="flex flex-col gap-2">
            <div className="btnSecondary">
              <Icon path={mdiCalendarClockOutline} size={1} />
            </div>
            <div>
              <DropdownMenu button={priorityButton} items={priorityItems} />
            </div>
          </div>

          <button className="btnPrimary px-5 ">
            <Icon path={mdiPlus} size={1.4} />
          </button>
        </div>
      </form>
    </div>
  )
}
