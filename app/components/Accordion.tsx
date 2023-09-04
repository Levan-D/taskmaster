/** @format */
"use client"

import React, { useState } from "react"
import Icon from "@mdi/react"
import { mdiChevronDown } from "@mdi/js"

type Props = {
  children: JSX.Element
  title: string
  className?: string
  isOpen?: boolean
}

export default function Accordion({ children, title, className, isOpen = true }: Props) {
  const [open, setOpen] = useState(isOpen)

  const toggleOpen = () => {
    setOpen(x => !x)
  }

  return (
    <div className={`${className}`}>
      <button onClick={toggleOpen} className="btnText  flex gap-1 items-center">
        <Icon
          className={`${open && "-rotate-180"} transition-transform duration-300`}
          path={mdiChevronDown}
          size={1.2}
        />
        <h2>{title}</h2>
      </button>
      <div className={` ${open && "is-open"} wrapper`}>
        <div className={`content`}> {children}</div>
      </div>
    </div>
  )
}
