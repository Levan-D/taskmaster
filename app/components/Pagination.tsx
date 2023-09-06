/** @format */

import React from "react"
import Icon from "@mdi/react"
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js"

type Props = {
  totalCount: number
  take: number
  skip: number
  setSkip: React.Dispatch<React.SetStateAction<number>>
  disabled: boolean
  className: string
}

export default function Pagination({
  totalCount,
  take,
  skip,
  setSkip,
  disabled,
  className,
}: Props) {
  const totalPages = Math.ceil(totalCount / take)

  const buttons = [...Array(totalPages)].map((element, i) => {
    const currentPage = Math.floor(skip / take)

    return (
      <button
        className={` ${
          currentPage === i && "!bg-neutral-500"
        } mainContainer hover:bg-neutral-700 duration-300 px-2`}
        onClick={() => setSkip(take * i)}
        disabled={disabled}
        key={i}
      >
        {i + 1}
      </button>
    )
  })
  if (totalPages < 2) return <span></span>

  return (
    <div className={`${className} flex gap-2`}>
      <button
        className={` ${
          skip === 0 ? "opacity-50" : "hover:bg-neutral-700"
        } mainContainer  duration-300 px-2`}
        onClick={() => setSkip(prevSkip => prevSkip - take)}
        disabled={skip === 0 || disabled}
      >
        <Icon path={mdiChevronLeft} size={1} />
      </button>

      {buttons}
      <button
        className={` ${
          skip + take >= totalCount ? "opacity-50" : "hover:bg-neutral-700"
        } mainContainer    duration-300 px-2`}
        onClick={() => setSkip(prevSkip => prevSkip + take)}
        disabled={totalCount ? skip + take >= totalCount : false || disabled}
      >
        <Icon path={mdiChevronRight} size={1} />
      </button>
    </div>
  )
}
