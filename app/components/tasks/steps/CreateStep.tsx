/** @format */
"use client"

import { createStep } from "../../../actions"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import Icon from "@mdi/react"
import { mdiPlus } from "@mdi/js"
import { toast } from "react-toastify"

type Props = {
  taskId: string
  totalSteps: number
  className?: string
}

export default function CreateStep({ taskId, totalSteps, className }: Props) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const submitForm = (data: FormData) => {
    if (totalSteps > 9) {
      return toast.warning(<div className="text-neutral-950">Step limit reached</div>, {
        toastId: "stepLimit",
      })
    }
    createStep(data, taskId)
    router.refresh()
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  return (
    <div className={`${className}  px-2 pt-2  w-full`}>
      <form ref={formRef} action={submitForm}>
        <div className="flex gap-2">
          <input
            placeholder="Add a step"
            className="input grow placeholder-neutral-300"
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
