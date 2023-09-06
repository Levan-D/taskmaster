/** @format */
"use client"

import { useEffect } from "react"
import { DateTime } from "luxon"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setTodaysOps, setWeeksOps } from "@/lib/redux/slices/globalSlice"

export default function useSetOps() {
  const dispatch = useAppDispatch()
  const today = DateTime.now().startOf("day")

  useEffect(() => {
    if (typeof window === "undefined") return

    const todaysLastOp = localStorage.getItem("todaysLastOp")
    const weeksLastOp = localStorage.getItem("weeksLastOp")

    if (todaysLastOp) {
      const lastOpConvertToDateTime = DateTime.fromISO(todaysLastOp).startOf("day")
      dispatch(setTodaysOps(today.hasSame(lastOpConvertToDateTime, "day")))
    } else dispatch(setTodaysOps(false))

    if (weeksLastOp) {
      const lastOpConvertToDateTime = DateTime.fromISO(weeksLastOp).startOf("day")
      dispatch(setWeeksOps(today.hasSame(lastOpConvertToDateTime, "day")))
    } else dispatch(setWeeksOps(false))
  }, [])
}
