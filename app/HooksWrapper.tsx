/** @format */

"use client"

import useSetOps from "./hooks/useSetOps"
import { setCookie, getCookie } from "cookies-next"
import { DateTime } from "luxon"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { setWindowWidth } from "@/lib/redux/slices/globalSlice"

import { useRouter } from "next/navigation"

export const HooksWrapper = (props: React.PropsWithChildren) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
 
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        dispatch(setWindowWidth(window.innerWidth))
      }, 250)
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      // Cleanup
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

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
