/** @format */
"use client"

import React from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { setWidget } from "@/lib/redux/slices/globalSlice"
import CookieClock from "./cookieClock.tsx/CookieClock"
import Icon from "@mdi/react"
import { mdiWindowClose, mdiCookieOutline } from "@mdi/js"

type Props = {
  className?: string
}

export default function WidgetDisplay({ className }: Props) {
  const dispatch = useAppDispatch()
  const { widget } = useAppSelector(state => state.global)

  if (!widget) return <></>

  const renderWidget = (widget: string | null) => {
    if (!widget) return

    switch (widget) {
      case "cookie clock":
        return <CookieClock />
    }
  }

  const widgetTitle = (widget: string | null) => {
    if (!widget) return

    switch (widget) {
      case "cookie clock":
        return (
          <div className="flex items-center gap-1">
            <Icon path={mdiCookieOutline} size={1} />{" "}
            <p className="lg:block  hidden">Cookie Clock</p>
          </div>
        )
    }
  }

  return (
    <div
      className={`${className}  mainContainer p-2 flex h-fit lg:flex-col flex-row-reverse  overflow-clip`}
    >
      <div className="flex   lg:flex-row  flex-col-reverse  shrink-0 justify-between items-center select-none">
        <h3>{widgetTitle(widget)}</h3>
        <button
          className="btnIcon p-0.5 text-neutral-300 hover:text-white"
          onClick={() => dispatch(setWidget(null))}
        >
          <Icon path={mdiWindowClose} size={0.8} />
        </button>
      </div>
      <hr className="  shrink-0 my-2 border-t-[1px] border-neutral-700" />
      <div className="  overflow-clip grow">{renderWidget(widget)}</div>
    </div>
  )
}
