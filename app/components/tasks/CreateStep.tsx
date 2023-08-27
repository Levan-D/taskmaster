/** @format */
"use client"
import { createStep } from "../../actions"
import { useRouter } from "next/navigation"
import { useRef } from "react"

type Props = {
  taskId: string
}

export default function CreateStep({ taskId }: Props) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="bg-neutral-900 p-4 rounded-lg w-full">
      <form
        ref={formRef}
        action={data => {
          createStep(data, taskId)
          router.refresh()
          if (formRef.current) {
            formRef.current.reset() // Reset the form
          }
        }}
      >
        <input className="input" name="title" type="text" required />
        <button>Submit</button>
      </form>
    </div>
  )
}
