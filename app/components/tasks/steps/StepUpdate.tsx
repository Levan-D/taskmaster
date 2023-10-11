/** @format */

import { useState, useRef, useEffect } from "react"
import Icon from "@mdi/react"
import { mdiNoteEditOutline } from "@mdi/js"
import { updateStep } from "@/app/actions/stepActions"
import { useTransition } from "react"

type Props = {
  task: Task
  step: Step
  expired: boolean

  addOptimisticTask: (action: Task[]) => void
  className?: string
}

const updateStepInTask = (task: Task, updatedStep: Step): Task => {
  const stepIndex = task.steps.findIndex(step => step.id === updatedStep.id)

  if (stepIndex !== -1) {
    const newSteps = [...task.steps]
    newSteps[stepIndex] = updatedStep

    const updatedTask = { ...task, steps: newSteps }

    return updatedTask
  }

  return task
}

export default function StepUpdate({
  task,
  step,
  addOptimisticTask,
  expired,
  className = "",
}: Props) {
  const [edit, setEdit] = useState(false)
  const [inputValue, setInputValue] = useState(step.title)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isPending, startTransition] = useTransition()

  const toggleEdit = () => {
    setInputValue(step.title)
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

    const handleUpdateStep = async () => {
      await updateStep({ title: inputValue, stepId: step.id })
    }

    toggleEdit()

    if (inputValue !== step.title) {
      const updatedStep = { ...step, title: inputValue }
      const updatedTasks = updateStepInTask(task, updatedStep)

      addOptimisticTask([updatedTasks])
      startTransition(handleUpdateStep)
    }
  }

  return edit ? (
    <div ref={containerRef} onBlur={handleBlur} className={`${className} mx-2`}>
      <form onSubmit={submitForm}>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            placeholder="Add a step"
            className="input w-full text-sm sm:text-base  py-1 grow"
            name="title"
            type="text"
            maxLength={190}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            required
          />
          <button disabled={isPending || expired} className="btnSecondary px-2.5 ">
            <Icon path={mdiNoteEditOutline} size={0.8} />
          </button>
        </div>
      </form>
    </div>
  ) : (
    <button
      disabled={isPending || expired}
      onDoubleClick={toggleEdit}
      className={`${step.complete && "text-neutral-300 "}  block text-left w-full mx-2 `}
    >
      <p className=" break-all line-clamp-1 text-sm sm:text-base ">{step.title}</p>
    </button>
  )
}
