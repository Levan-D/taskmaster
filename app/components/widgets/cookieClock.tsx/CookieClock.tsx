/** @format */
"use client"

import { useTransition, useEffect, useState } from "react"
import { getCookieClockData } from "@/app/actions/cookieClockActions"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { setModal, setCookieClockData } from "@/lib/redux/slices/globalSlice"
import Icon from "@mdi/react"
import { mdiPlus } from "@mdi/js"
import Loader from "../../Loader"
import CookieTimer from "./CookieTimer"

export default function CookieClock() {
  const dispatch = useAppDispatch()
  const { cookieClockData } = useAppSelector(state => state.global)

  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const handleGetCookieClockData = async () => {
    startTransition(async () => {
      try {
        const data = await getCookieClockData()
        dispatch(setCookieClockData(data.data))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching cookie clock data:", error)
      }
    })
  }

  useEffect(() => {
    handleGetCookieClockData()
  }, [])

  const handleSetNewCookieClock = () => {
    dispatch(setModal({ open: true, type: "cookie clock", taskId: "" }))
  }

  if (isPending || loading)
    return (
      <div className=" flex flex-col justify-center h-full py-12  ">
        <Loader className="!bg-neutral-900 !bg-opacity-75 !max-w-[50px] !max-h-[50px] lg:!max-w-[150px] lg:!max-h-[150px]" />
      </div>
    )

  if (cookieClockData === null || cookieClockData === undefined)
    return (
      <div className=" flex flex-col justify-center h-full   ">
        <button
          className="btnPrimary  max-w-[444px] mx-auto w-2/3 py-2"
          onClick={handleSetNewCookieClock}
        >
          <div className="flex items-center gap-1 w-fit mx-auto">
            <Icon path={mdiPlus} size={0.7} />
            <p>New</p>
          </div>
        </button>
      </div>
    )

  if (cookieClockData)
    return (
      <div className=" flex flex-col justify-between h-full   ">
        <CookieTimer handleSetNewCookieClock={handleSetNewCookieClock} />
      </div>
    )
}
