/** @format */
"use client"
import { useState } from "react"
import { createStep } from "../../actions"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import Icon from "@mdi/react"
import { mdiPlus, mdiChevronDown } from "@mdi/js"

type Props = {
  taskId: string
}

export default function CreateStep({ taskId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className=" px-2 pt-2  w-full">
      {isOpen && (
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
      )}
      <button onClick={() => setIsOpen(x => !x)} className="w-full block bg-red-300">
        <Icon className="mx-auto" path={mdiChevronDown} size={1} />
      </button>
    </div>
  )
}
