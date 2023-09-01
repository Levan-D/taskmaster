/** @format */

"use client"

import { useState, useRef, useEffect } from "react"
import Icon from "@mdi/react"
import { mdiNoteEditOutline } from "@mdi/js"
import { updateStep } from "@/app/actions"
import { useTransition } from "react"

type Props = {
  title: string
  stepId: string
  complete: boolean
  className?: string
  optimisticTitle: string
  addOptimisticTitle: (action: string) => void
}

export default function StepUpdate({
  title,
  stepId,
  complete,
  className,
  optimisticTitle,
  addOptimisticTitle,
}: Props) {
  const [edit, setEdit] = useState(false)
  const [inputValue, setInputValue] = useState(title)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isPending, startTransition] = useTransition()

  const toggleEdit = () => {
    setInputValue(title)
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
      await updateStep({ title: inputValue, stepId: stepId })
    }

    toggleEdit()

    if (inputValue !== title) {
      addOptimisticTitle(inputValue)
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
            className="input    py-1 grow"
            name="title"
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            required
          />
          <button disabled={isPending} className="btnSecondary px-2.5 ">
            <Icon path={mdiNoteEditOutline} size={0.8} />
          </button>
        </div>
      </form>
    </div>
  ) : (
    <button
      disabled={isPending}
      onDoubleClick={toggleEdit}
      className={`${complete && "text-neutral-300 "}  block text-left w-full mx-2 `}
    >
      {optimisticTitle}
    </button>
  )
}
