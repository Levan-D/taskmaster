/** @format */

import React from "react"

type Props = {
  total: number
  completed: number
}

export default function TaskCounter({ total, completed }: Props) {
  const allCompleted = total === completed && total > 0

  return (
    <div className="flex items-center select-none mt-10 mb-12">
      <hr
        className={` ${
          allCompleted ? "  border-lime-400" : "  border-neutral-500"
        } mx-4  block grow border-t-[1px]  border-opacity-75`}
      />
      <div
        className={`${
          allCompleted ? "text-lime-400 " : "text-neutral-500 "
        }  p-1.5 text-sm  shrink-0 `}
      >
        {`${total}/${completed}`}
      </div>
      <hr
        className={` ${
          allCompleted ? "  border-lime-400" : "  border-neutral-500"
        } mx-4    block grow border-t-[1px]  border-opacity-75`}
      />
    </div>
  )
}
