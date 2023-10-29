/** @format */

import React from "react"

type Props = {
  className?: string
  containerHeight?: string
}

export default function Loader({ className, containerHeight }: Props) {
  return (
    <div
      className={`${containerHeight} min-h-[calc(80dvh)]  flex flex-col justify-center items-center`}
    >
      <div
        className={`${className} loader sm:!w-[250px]  sm:!h-[250px] !w-[125px]  !h-[125px]  mx-auto`}
      ></div>
    </div>
  )
}
