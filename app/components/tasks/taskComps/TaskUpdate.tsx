/** @format */

import { useState, useRef, useEffect } from "react"
import Icon from "@mdi/react"
import { mdiNoteEditOutline, mdiTimerAlertOutline } from "@mdi/js"
import { updateTask } from "@/app/actions/taskActions"
import Tooltip from "../../Tooltip"
import DropdownMenu from "../../DropdownMenu"
import { useTransition } from "react"

type Props = {
  task: Task
  className?: string
  expired: boolean
  addOptimisticTask: (action: Task[]) => void
}

export default function TaskUpdate({
  task,
  className,
  addOptimisticTask,
  expired,
}: Props) {
  const [edit, setEdit] = useState(false)
  const [inputValue, setInputValue] = useState(task.title)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  const [isPending, startTransition] = useTransition()

  const priorityButton = (
    <Tooltip text="Task priority" position="bot" className="delay-1000 shrink-0 ">
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
    setInputValue(task.title)
    setEdit(x => !x)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      toggleEdit()
      setPriority(task.priority)
    }
  }

  useEffect(() => {
    if (inputRef.current && edit) {
      inputRef.current.focus()
    }
  }, [edit])

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const handleUpdateTask = async () => {
      await updateTask({ title: inputValue, taskId: task.id, priority: priority })
    }

    toggleEdit()

    if (inputValue !== task.title || priority !== task.priority) {
      addOptimisticTask([{ ...task, title: inputValue, priority: priority }])

      startTransition(handleUpdateTask)
    }
  }

  return edit ? (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className={`${className} !line-clamp-1    mx-2  `}
    >
      <form onSubmit={submitForm}>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            placeholder="Add a step"
            className="input w-full text-sm sm:text-lg py-1 grow"
            name="title"
            maxLength={190}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            required
          />

          <DropdownMenu button={priorityButton} items={priorityItems} />

          <button
            disabled={isPending || expired}
            className="btnSecondary px-2.5 shrink-0 "
          >
            <Icon path={mdiNoteEditOutline} size={0.8} />
          </button>
        </div>
      </form>
    </div>
  ) : (
    <button
      disabled={isPending || expired || task.deleted}
      onDoubleClick={toggleEdit}
      className="block text-left mx-2 w-full"
    >
      <p className=" break-all line-clamp-1 text-sm sm:text-base ">{task.title}</p>
    </button>
  )
}
