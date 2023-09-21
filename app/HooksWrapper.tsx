/** @format */

"use client"

import useSetOps from "./hooks/useSetOps"
import { setCookie, getCookie } from "cookies-next"
import { DateTime } from "luxon"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const HooksWrapper = (props: React.PropsWithChildren) => {
  const router = useRouter()
  const today = DateTime.local().startOf("day").toISO()

  useEffect(() => {
    const userTime = getCookie("user_time")
    const userTimeFormatted = userTime
      ? DateTime.fromISO(userTime).toISO()
      : DateTime.now().startOf("day").toISO()
    const today = DateTime.now().startOf("day").toISO() ?? ""

    if (today !== userTimeFormatted) {
      setCookie("user_time", today)
      router.refresh()
    }
  }, [])

  useSetOps()

  return <div>{props.children}</div>
}
