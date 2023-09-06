/** @format */

"use client"

import useSetOps from "./hooks/useSetOps"

export const HooksWrapper = (props: React.PropsWithChildren) => {
  useSetOps()

  return <div>{props.children}</div>
}
