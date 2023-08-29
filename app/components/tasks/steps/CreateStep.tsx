/** @format */
"use client"

import { createStep } from "../../../actions"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import Icon from "@mdi/react"
import { mdiPlus } from "@mdi/js"

type Props = {
  taskId: string
}

export default function CreateStep({ taskId }: Props) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const submitForm = (data: FormData) => {
    createStep(data, taskId)
    router.refresh()
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  return (
    <div className=" px-2 pt-2  w-full">
      <form ref={formRef} action={submitForm}>
        <div className="flex gap-2">
          <input
            placeholder="Add a step"
            className="input grow"
            name="title"
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
