/** @format */
"use client"
import React from "react"
import Icon from "@mdi/react"
import { DateTime } from "luxon"
import DropdownMenu from "../DropdownMenu"
import WidgetMenu from "../widgets/WidgetMenu"
import { usePathname } from "next/navigation"
import { mdiCircleDouble } from "@mdi/js"
import { taskPages } from "../Sidebar"

type Props = {
  dropdownMenuItems?: {
    button: JSX.Element
    items: DropDownItemType
    classname?: string
  }[]
}

export default function TaskHeader({ dropdownMenuItems }: Props) {
  const today = DateTime.now().startOf("day").toFormat("EEEE, MMMM d")
  const pathname = usePathname()

  const taskPage = taskPages.find(page =>
    "path" in page
      ? pathname === (typeof page.path === "string" ? page.path : page.path.pathname)
      : false
  ) as { icon: string; title: string } | undefined

  const title = taskPage?.title || "Default Title"
  const icon = taskPage ? taskPage.icon : mdiCircleDouble

  return (
    <div className="mainContainer p-2 pt-12 sm:pt-4 rounded-t-none border-neutral-900 bg-neutral-950     flex  justify-between ">
      <div className="">
        <div className="select-none">
          <div className="flex gap-2 items-center">
            <div>
              <Icon path={icon} size={0.98} />
            </div>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <p className="text-neutral-300 text-xs pl-[1px] pt-1">{today}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <WidgetMenu />
        {dropdownMenuItems &&
          dropdownMenuItems.length > 0 &&
          dropdownMenuItems.map((menu, i) => (
            <DropdownMenu
              items={menu.items}
              button={menu.button}
              menuClassName={menu.classname}
              key={i}
            />
          ))}
      </div>
    </div>
  )
}
