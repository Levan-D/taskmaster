/** @format */
"use client"

import { useState } from "react"
import Steps from "./Steps"
import CreateStep from "./CreateStep"
import Icon from "@mdi/react"
import { mdiChevronDown } from "@mdi/js"

type Props = {
  taskId: string
  data: Step[] | undefined
  taskState: boolean
}

export default function StepsWrapper({ taskId, data, taskState }: Props) {
  const [isOpen, setIsOpen] = useState(data && data.length > 0 &&  !taskState ? true : false)
  return (
    <>
      <div className={`${isOpen ? " visible   mt-4" : "collapse h-0 "} `}>
        <hr className={`mx-4 mb-2  border-t-[1px] border-neutral-700`} />

        <div className="my-2">
          {" "}
          <CreateStep taskId={taskId} />
        </div>
        {data && data.length > 0 && (
          <div className="my-2">
            <Steps data={data} />
          </div>
        )}
      </div>

      <button
        onClick={() => setIsOpen(x => !x)}
        className={`  w-full btnSecondary bg-transparent rounded-t-none py-0 rounded-b-lg`}
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
