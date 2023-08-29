/** @format */

"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Icon from "@mdi/react"
import { mdiNoteEditOutline, mdiTimerAlertOutline } from "@mdi/js"
import { updateTask } from "@/app/actions"
import Tooltip from "../../Tooltip"
import DropdownMenu from "../../DropdownMenu"

type Props = {
  title: string
  taskId: string
  taskPriority: TaskPriority
}

export default function TaskUpdate({ title, taskId, taskPriority }: Props) {
  const [edit, setEdit] = useState(false)
  const [inputValue, setInputValue] = useState(title)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [priority, setPriority] = useState<TaskPriority>(taskPriority)

  const priorityButton = (
    <Tooltip text="Task priority" position="bot" customCSS="delay-1000 shrink-0 ">
      <div
        className={`${
          priority === "LOW"
            ? "text-sky-400"
            : priority === "MEDIUM"
            ? "text-amber-400"
            : "text-rose-400"
        } btnSecondary p-2 `}
      >
        <Icon path={mdiTimerAlertOutline} size={1} />
      </div>
    </Tooltip>
  )

  const priorityItems: DropDownItemType = [
    {
      title: "Low",
      icon: <Icon className="text-sky-400" path={mdiTimerAlertOutline} size={0.7} />,
      action: () => {
        setPriority("LOW")
        if (inputRef.current && edit) {
          inputRef.current.focus()
        }
      },
    },
    {
      title: "Medium",
      icon: <Icon className="text-amber-400" path={mdiTimerAlertOutline} size={0.7} />,
      action: () => {
        setPriority("MEDIUM")
        if (inputRef.current && edit) {
          inputRef.current.focus()
        }
      },
    },
    {
      title: "High",
      icon: <Icon className="text-rose-400" path={mdiTimerAlertOutline} size={0.7} />,
      action: () => {
        setPriority("HIGH")
        if (inputRef.current && edit) {
          inputRef.current.focus()
        }
      },
    },
  ]

  const toggleEdit = () => {
    setInputValue(title)
    setEdit(true)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      setEdit(false)
      setPriority(taskPriority)
    }
  }

  useEffect(() => {
    if (inputRef.current && edit) {
      inputRef.current.focus()
    }
  }, [edit])

  const submitForm = (data: FormData) => {
    console.log(`cccclik`)

    if (inputValue !== title || priority !== taskPriority) {
      console.log(`submited`)
      updateTask(data, taskId, priority)
      router.refresh()
    }
    setEdit(false)
  }

  return edit ? (
    <div ref={containerRef} onBlur={handleBlur} className="mx-2">
      <form action={submitForm}>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            placeholder="Add a step"
            className="input text-lg   py-1 grow"
            name="title"
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            required
          />
          <div>
            <DropdownMenu button={priorityButton} items={priorityItems} />
          </div>
          <button className="btnSecondary px-2.5 shrink-0 ">
            <Icon path={mdiNoteEditOutline} size={0.8} />
          </button>
        </div>
      </form>
    </div>
  ) : (
    <button
      onDoubleClick={toggleEdit}
      className="block text-left text-lg  w-full mx-2   "
    >
      {title}
    </button>
  )
}
