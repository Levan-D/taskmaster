/** @format */
"use client"
import { useAppSelector } from "@/lib/redux/hooks"
import { createTask } from "../actions"
import { useRouter } from "next/navigation"
import { useRef } from "react"

export default function CreateTask() {
  const { user } = useAppSelector(state => state.global)
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  
  return (
    <div className="bg-neutral-900 p-4 rounded-lg w-full">
      <form
        ref={formRef}
        action={data => {
          if (user?.loginId) {
            createTask(data, user?.loginId)
            router.refresh()
            if (formRef.current) {
              formRef.current.reset() // Reset the form
            }
          }
        }}
      >
        <input className="input" name="title" type="text" required />
        <button>Submit</button>
      </form>
    </div>
  )
}
