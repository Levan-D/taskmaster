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

  useEffect(() => {
    let refreshTimeout: ReturnType<typeof setTimeout>

    function resetRefreshTimer() {
      clearTimeout(refreshTimeout)

      refreshTimeout = setTimeout(() => {
        window.location.reload()
      }, 300000) // 5 minutes in milliseconds
    }

    resetRefreshTimer()

    const handleUserInteraction = () => {
      resetRefreshTimer()
    }

    document.addEventListener("mousemove", handleUserInteraction)
    document.addEventListener("mousedown", handleUserInteraction)
    document.addEventListener("keydown", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)
    document.addEventListener("scroll", handleUserInteraction)

    return () => {
      clearTimeout(refreshTimeout)
      document.removeEventListener("mousemove", handleUserInteraction)
      document.removeEventListener("mousedown", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("scroll", handleUserInteraction)
    }
  }, [])

  useSetOps()

  return <div>{props.children}</div>
}
