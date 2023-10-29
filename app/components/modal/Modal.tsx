/** @format */
"use client"
import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import Icon from "@mdi/react"
import {
  mdiClose,
  mdiTimerOutline,
  mdiCookieOutline,
  mdiCircleDouble,
  mdiSync,
} from "@mdi/js"
import { setModal } from "@/lib/redux/slices/globalSlice"
import Timer from "./Timer"
import CookieClock from "./CookieClock"
import Habit from "./Habit"

export default function Modal() {
  const dispatch = useAppDispatch()
  const {
    modal: { open, type, taskId },
  } = useAppSelector(state => state.global)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  const handleCloseModal = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      dispatch(setModal({ open: false, type: null, taskId: "" }))
    }
  }

  const handleCloseButtonClick = () => {
    dispatch(setModal({ open: false, type: null, taskId: "" }))
  }

  const renderContenet = () => {
    switch (type) {
      case "timer":
        return <Timer taskId={taskId} />
      case "cookie clock":
        return <CookieClock />
      case "habit":
        return <Habit />

      default:
        return null
    }
  }

  const renderTitle = () => {
    switch (type) {
      case "timer":
        return "Set timer"
      case "cookie clock":
        return "Cookie Clock"
      case "habit":
        return "Habit"

      default:
        return null
    }
  }

  const renderIcon = () => {
    switch (type) {
      case "timer":
        return mdiTimerOutline
      case "cookie clock":
        return mdiCookieOutline
      case "habit":
        return mdiSync

      default:
        return mdiCircleDouble
    }
  }

  return (
    <div
      onClick={handleCloseModal}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        open ? "visible opacity-100" : "collapse opacity-0"
      }`}
    >
      <div className="z-50  flex min-h-[360px] w-full max-w-[540px]  flex-col   mainContainer     md:min-h-[600px] ">
        <div className=" flex grow flex-col rounded-xl      px-6 py-4 ">
          <div className="flex  items-center justify-between">
            <div className="flex gap-1  items-center">
              <Icon path={renderIcon()} size={0.98} />
              <h3 className="text-xl font-semibold">{renderTitle()}</h3>
            </div>
            <button
              aria-label="close"
              onClick={handleCloseButtonClick}
              className=" active:text-neutral-400 hover:text-neutral-200"
            >
              <Icon path={mdiClose} size={1} />
            </button>
          </div>

          <hr className="my-4 h-0.5 border-none bg-neutral-600 opacity-50" />

          <div className="flex flex-col grow">{renderContenet()}</div>
        </div>
      </div>
    </div>
  )
}
