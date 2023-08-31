/** @format */
"use client"

import React, { memo, useState } from "react"

type Props = {
  text: string
  position?: "left" | "right" | "bot"
  onClick?: boolean
  dArrow?: boolean
  children: React.ReactNode
  className?: string
}

const Tooltip = memo(({ text, children, position, onClick, className }: Props) => {
  const [style, setStyle] = useState(onClick ? false : true)

  let positionStyle = " -top-10 left-1/2 -translate-x-1/2 "

  switch (position) {
    case "left":
      positionStyle = " right-10 top-1/2 -translate-y-1/2  "
      break
    case "right":
      positionStyle = " left-10 top-1/2 -translate-y-1/2 "
      break
    case "bot":
      positionStyle = " -bottom-10 left-1/2 -translate-x-1/2 "
      break
  }

  return (
    <span
      className="group relative"
      onClick={() => onClick && setStyle(() => true)}
      onMouseLeave={() => onClick && setStyle(() => false)}
    >
      {style && (
        <span
          className={`${positionStyle} ${className} pointer-events-none  absolute z-50  whitespace-nowrap rounded-xl border-[1px] border-neutral-200 bg-neutral-950 px-3 py-1 text-sm text-neutral-200 opacity-0   duration-200   sm:group-hover:opacity-100`}
        >
          {text}
        </span>
      )}
      {children}
    </span>
  )
})

Tooltip.displayName = "Tooltip"

export default Tooltip
