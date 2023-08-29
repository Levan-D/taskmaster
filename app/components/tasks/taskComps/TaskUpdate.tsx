/** @format */

"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Icon from "@mdi/react"
import { mdiNoteEditOutline } from "@mdi/js"
import { updateTask } from "@/app/actions"

type Props = {
  title: string
  taskId: string
}

export default function TaskUpdate({ title, taskId }: Props) {
  const [edit, setEdit] = useState(false)
  const [inputValue, setInputValue] = useState(title)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const toggleEdit = () => {
    setInputValue(title)
    setEdit(true)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      setEdit(false)
    }
  }

  useEffect(() => {
    if (inputRef.current && edit) {
      inputRef.current.focus()
    }
  }, [edit])

  const submitForm = (data: FormData) => {
    if (inputValue !== title) {
      updateTask(data, taskId)
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
          <button className="btnSecondary px-2.5 ">
            <Icon path={mdiNoteEditOutline} size={0.8} />
          </button>
        </div>
      </form>
    </div>
  ) : (
    <p onDoubleClick={toggleEdit} className=" text-lg  w-full mx-2   ">
      {title}
    </p>
  )
}
