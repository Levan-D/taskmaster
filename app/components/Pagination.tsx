/** @format */

import React from "react"
import Icon from "@mdi/react"
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

type Props = {
  pageCount: number
  currentPage: number
  className?: string
}

export default function Pagination({ pageCount, currentPage, className }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const buttons = [...Array(pageCount)].map((element, i) => {
    return (
      <button
        className={` ${
          currentPage - 1 === i && "!bg-neutral-500"
        } mainContainer hover:bg-neutral-700 duration-300 px-2`}
        onClick={() => router.push(`${pathname}/?page=${i + 1}`)}
        key={i}
      >
        {i + 1}
      </button>
    )
  })
  if (pageCount < 2) return <span></span>

  return (
    <div className={`${className} flex gap-2 select-none`}>
      <button
        className={` ${
          currentPage <= 1 ? "opacity-50" : "hover:bg-neutral-700"
        } mainContainer  duration-300 px-2`}
        onClick={() => router.push(`${pathname}/?page=${currentPage - 1}`)}
        disabled={currentPage <= 1}
      >
        <Icon path={mdiChevronLeft} size={1} />
      </button>

      {buttons}
      <button
        className={` ${
          currentPage >= pageCount ? "opacity-50" : "hover:bg-neutral-700"
        } mainContainer    duration-300 px-2`}
        onClick={() => router.push(`${pathname}/?page=${currentPage + 1}`)}
        disabled={currentPage >= pageCount}
      >
        <Icon path={mdiChevronRight} size={1} />
      </button>
    </div>
  )
}
