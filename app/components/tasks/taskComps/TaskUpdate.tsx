/** @format */

import { useState, useRef, useEffect } from "react"
import Icon from "@mdi/react"
import { mdiNoteEditOutline } from "@mdi/js"
import { updateTask } from "@/app/actions/taskActions"
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
  const [isPending, startTransition] = useTransition()

  const toggleEdit = () => {
    setInputValue(task.title)
    setEdit(x => !x)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      toggleEdit()
    }
  }

  useEffect(() => {
    if (inputRef.current && edit) {
      inputRef.current.focus()
    }
  }, [edit])

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    toggleEdit()

    if (inputValue !== task.title) {
      startTransition(async () => {
        try {
          addOptimisticTask([{ ...task, title: inputValue, priority: task.priority }])
          await updateTask({
            title: inputValue,
            taskId: task.id,
            priority: task.priority,
          })
        } catch (error) {
          console.error("Failed to update tasks:", error)
        }
      })
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

          <button
            aria-label="Submit edited task"
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
      aria-label="Toggle edit task"
      disabled={isPending || expired || task.deleted}
      onDoubleClick={toggleEdit}
      className="block text-left mx-2 w-full"
    >
      <p className=" break-all line-clamp-1 text-sm sm:text-base ">{task.title}</p>
    </button>
  )
}
