/** @format */

import React from "react"

type Props = {
  className?: string
}

export default function Loader({ className }: Props) {
  return (
    <div className="w-fit mx-auto  h-2/3  sm:h-full flex flex-col justify-center   ">
      <div
        className={`${className} loader sm:!w-[250px]  sm:!h-[250px] !w-[125px]  !h-[125px]`}
      ></div>
    </div>
  )
}
