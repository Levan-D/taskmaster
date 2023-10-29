/** @format */

import React from "react"
import DropdownMenu from "../DropdownMenu"
import Icon from "@mdi/react"
import { mdiWidgetsOutline, mdiCookieOutline } from "@mdi/js"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setWidget } from "@/lib/redux/slices/globalSlice"

export default function WidgetMenu() {
  const dispatch = useAppDispatch()

  const items: DropDownItemType = [
    {
      title: "Cookie Clock",
      icon: <Icon path={mdiCookieOutline} size={1} />,
      action: () => dispatch(setWidget("cookie clock")),
    },
  ]

  return (
    <DropdownMenu items={items} menuClassName="-translate-x-32">
      <div className="btnIcon text-neutral-300 hover:text-white  p-2">
        <Icon path={mdiWidgetsOutline} size={1} />
      </div>
    </DropdownMenu>
  )
}
