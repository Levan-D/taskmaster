/** @format */
"use client"

import { useState } from "react"
import Steps from "./Steps"
import CreateStep from "./CreateStep"
import Icon from "@mdi/react"
import { mdiChevronDown } from "@mdi/js"

type Props = {
  taskId: string
  steps: Step[] | undefined
  taskIsComplete: boolean
}

export default function StepsWrapper({ taskId, steps, taskIsComplete }: Props) {
  const [isOpen, setIsOpen] = useState(
    steps && steps.length > 0 && !taskIsComplete ? true : false
  )
  return (
    <>
      <div className={`${isOpen ? " visible   mt-4" : "collapse h-0 "} `}>
        <hr className={`mx-4 mb-2  border-t-[1px] border-neutral-700`} />

        <div className="my-2">
          <CreateStep taskId={taskId} />
        </div>
        {steps && steps.length > 0 && (
          <div className="my-2">
            <Steps steps={steps} />
          </div>
        )}
      </div>

      <button
        onClick={() => setIsOpen(x => !x)}
        className={`  w-full sm:hover:bg-neutral-500 block transition-color duration-300 rounded-b-lg`}
      >
        <Icon
          className={` ${
            isOpen && "rotate-180 "
          } transition-transform duration-300 mx-auto `}
          path={mdiChevronDown}
          size={1}
        />
      </button>
    </>
  )
}
