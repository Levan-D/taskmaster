/** @format */
"use client"

import React from "react"
import { useAppSelector } from "@/lib/redux/hooks"
import CookieClock from "./cookieClock.tsx/CookieClock"

type Props = {
  className?: string
}

export default function WidgetDisplay({ className }: Props) {
  const { widget } = useAppSelector(state => state.global)

  if (!widget) return <></>

  const renderWidget = (widget: string | null) => {
    if (!widget) return

    switch (widget) {
      case "cookie clock":
        return <CookieClock />
    }
  }

  return (
    <div className={`${className}`}>
      <div>{renderWidget(widget)}</div>
    </div>
  )
}
