/** @format */

import { createStep } from "../../../actions/stepActions"
import { useState } from "react"
import Icon from "@mdi/react"
import { mdiPlus, mdiLoading } from "@mdi/js"
import { toast } from "react-toastify"
import { useTransition } from "react"
import { DateTime } from "luxon"

type Props = {
  task: Task
  totalSteps: number
  className?: string
  addOptimisticTask: (action: Task[]) => void
}

export default function CreateStep({
  task,
  totalSteps,
  className,
  addOptimisticTask,
}: Props) {
  const [title, setTitle] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [focus, setFocus] = useState(false)

  const [isPending, startTransition] = useTransition()

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (totalSteps > 9) {
      return toast.warning(<div className="text-neutral-950">Step limit reached</div>, {
        toastId: "stepLimit",
      })
    }

    const newStep: Step = {
      id: "optimistic",
      title: title,
      deleted: false,
      complete: false,
      creation_date: DateTime.now().toJSDate(),
      taskId: task.id,
    }
    const newSteps = [newStep, ...task.steps]
    const updatedTasks = { ...task, steps: newSteps }

    startTransition(async () => {
      try {
        addOptimisticTask([updatedTasks])
        await createStep({ title: title, taskId: task.id })
      } catch (error) {
        console.error("Failed to create step:", error)
      }
    })

    setTitle("")
    setCharCount(0)
  }

  return (
    <div className={`${className}  px-2 pt-2  w-full`}>
      <form onSubmit={submitForm}>
        <div className="flex gap-2 relative">
          <input
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder="Add a step"
            className="input w-full grow placeholder-neutral-300 text-sm sm:text-base"
            name="title"
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
            } text-xs text-neutral-400 absolute  right-14 top-6   z-30`}
          >
            {focus && `${charCount}/190`}
          </p>

          <button
            aria-label="Create step"
            disabled={isPending}
            className={`${isPending && "opacity-75"} btnSecondary px-2.5 ${
              charCount === 0 && "cursor-not-allowed"
            }`}
          >
            <Icon path={isPending ? mdiLoading : mdiPlus} size={1} spin={isPending} />
          </button>
        </div>
      </form>
    </div>
  )
}
