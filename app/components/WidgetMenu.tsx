/** @format */

import React from "react"
import DropdownMenu from "./DropdownMenu"
import Icon from "@mdi/react"
import { mdiWidgetsOutline, mdiCookieOutline } from "@mdi/js"

export default function WidgetMenu() {
  const button = (
    <div className="btnIcon text-neutral-300 hover:text-white  p-2">
      <Icon path={mdiWidgetsOutline} size={1} />
    </div>
  )

  const items: DropDownItemType = [
    {
      title: "Cookie Clock",
      icon: <Icon path={mdiCookieOutline} size={1} />,
      action: () => console.log(`cookcook`),
    },
  ]

  return <DropdownMenu button={button} items={items} menuClassName="-translate-x-32" />
}
