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
    const timeZone = DateTime.local().zoneName
    const cookieZone = DateTime.fromISO(getCookie("user_time") || "").zoneName

    if (timeZone !== cookieZone) {
      setCookie("user_time", today)
      router.refresh()
    }
  }, [])

  useSetOps()

  return <div>{props.children}</div>
}
