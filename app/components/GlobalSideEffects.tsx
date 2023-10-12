/** @format */

"use client"
import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { setWindowWidth } from "@/lib/redux/slices/globalSlice"

export default function GlobalSideEffects() {
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

  return <></>
}
