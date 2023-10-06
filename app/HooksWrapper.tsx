/** @format */

"use client"

import useSetOps from "./hooks/useSetOps"
import { setCookie, getCookie } from "cookies-next"
import { DateTime } from "luxon"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const HooksWrapper = (props: React.PropsWithChildren) => {
  const router = useRouter()

  useEffect(() => {
    const userTime = getCookie("user_time")
    const userTimeFormatted = userTime ? DateTime.fromISO(userTime).toISO() : undefined
    const today = DateTime.now().startOf("day").toISO() ?? ""

    if (today !== userTimeFormatted) {
      setCookie("user_time", today)
      router.refresh()
    }
  }, [])

  useSetOps()

  return <div>{props.children}</div>
}
