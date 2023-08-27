/** @format */
"use client"

import Icon from "@mdi/react"
import { mdiDotsVertical } from "@mdi/js"
import DropdownMenu from "../DropdownMenu"

type Props = { taskId: string }

export default function TaskDropDown({ taskId }: Props) {
  const items = [
    {
      title: "test",
      action: () => console.log(`alo`),
    },
  ]
  const button = (
    <div className="  hover:bg-neutral-600  rounded-tr-lg rounded-bl-lg p-2 duration-300">
      <Icon path={mdiDotsVertical} size={1} />
    </div>
  )
  return (
    <div>
      <DropdownMenu customCSS="block" button={button} items={items} />
    </div>
  )
}
