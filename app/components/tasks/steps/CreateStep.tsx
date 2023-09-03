/** @format */

import { createStep } from "../../../actions"
import { useState } from "react"
import Icon from "@mdi/react"
import { mdiPlus } from "@mdi/js"
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
  const [isPending, startTransition] = useTransition()

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (totalSteps > 9) {
      return toast.warning(<div className="text-neutral-950">Step limit reached</div>, {
        toastId: "stepLimit",
      })
    }

    const handleCreateStep = async () => {
      await createStep({ title: title, taskId: task.id })
    }

    const newStep: Step = {
      id: "000",
      title: title,
      deleted: false,
      complete: false,
      creation_date: DateTime.now().toJSDate(),
      taskId: task.id,
    }
    const newSteps = [newStep, ...task.steps]
    const updatedTasks = { ...task, steps: newSteps }

    addOptimisticTask([updatedTasks])
    startTransition(handleCreateStep)
    setTitle("")
  }

  return (
    <div className={`${className}  px-2 pt-2  w-full`}>
      <form onSubmit={submitForm}>
        <div className="flex gap-2">
          <input
            placeholder="Add a step"
            className="input grow placeholder-neutral-300"
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            type="text"
            required
          />
          <button className="btnSecondary px-2.5 ">
            <Icon path={mdiPlus} size={1} />
          </button>
        </div>
      </form>
    </div>
  )
}
