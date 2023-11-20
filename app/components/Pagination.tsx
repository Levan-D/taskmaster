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

  const maxButtonsVisible = 5

  const startPage = Math.max(currentPage - Math.floor(maxButtonsVisible / 2), 1)
  const endPage = Math.min(startPage + maxButtonsVisible - 1, pageCount)

  const buttons = []

  if (startPage > 1) {
    buttons.push(
      <button
        aria-label={`Go to first page`}
        key="1"
        className={` ${
          currentPage <= 1 && "!bg-neutral-500"
        } mainContainer hover:bg-neutral-700 duration-300 px-2`}
        onClick={() => router.push(`${pathname}/?page=${1}`)}
      >
        1
      </button>,
      <span key="start-ellipsis">...</span>
    )
  }

  for (let i = startPage; i <= endPage; i++) {
    buttons.push(
      <button
        aria-label={`Go to page ${i}`}
        key={i}
        className={`     ${
          currentPage === i || (i === 1 && currentPage === 0) ? "!bg-neutral-500" : ""
        } 
        mainContainer hover:bg-neutral-700 duration-300 px-2`}
        onClick={() => router.push(`${pathname}/?page=${i}`)}
      >
        {i}
      </button>
    )
  }

  if (endPage < pageCount) {
    buttons.push(
      <span key="end-ellipsis">...</span>,
      <button
        aria-label={`Go to last page`}
        key={pageCount}
        className={` ${
          currentPage >= pageCount && "!bg-neutral-500"
        } mainContainer hover:bg-neutral-700 duration-300 px-2`}
        onClick={() => router.push(`${pathname}/?page=${pageCount}`)}
      >
        {pageCount}
      </button>
    )
  }

  if (pageCount < 2) return <span></span>

  return (
    <div className={`${className} flex gap-2 select-none`}>
      <button
        aria-label="Go to previous page"
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
        aria-label="Go to next page"
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
