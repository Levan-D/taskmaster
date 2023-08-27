/** @format */
"use client"
import { createTask } from "../../actions"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import Icon from "@mdi/react"
import { mdiPlus } from "@mdi/js"

export default function CreateTask() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className=" pt-1 p-2 mainContainer w-full">
      <h1 className="text-xl font-semibold mb-2">Create a task!</h1>
      <form
        ref={formRef}
        action={data => {
          createTask(data)
          router.refresh()
          if (formRef.current) {
            formRef.current.reset() // Reset the form
          }
        }}
      >
        <div className="flex gap-2">
          <input
            placeholder="Create a task"
            className="input grow"
            name="title"
            type="text"
            required
          />
          <button className="btnSecondary px-3 ">
            <Icon path={mdiPlus} size={1} />
          </button>
        </div>
      </form>
    </div>
  )
}
