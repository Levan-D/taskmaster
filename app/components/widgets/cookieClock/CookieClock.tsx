/** @format */
"use client"

import { useTransition, useEffect, useState } from "react"
import { getCookieClockData } from "@/app/actions/cookieClockActions"
import Icon from "@mdi/react"
import { mdiPlus, mdiCookieOutline } from "@mdi/js"
import Loader from "../../Loader"
import CookieTimer from "./CookieTimer"
import Modal from "../../modal/Modal"
import CookieClockModal from "../../modal/CookieClock"
import { cookieClockModalNode } from "../../modal/modalPortal"
import { DateTime } from "luxon"

export default function CookieClock() {
  const [isCookieClockOpen, setIsCookieClockOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [cookieClockData, setCookieClockData] = useState<CookieClockType | null>(null)

  const handleCloseCookieClockModal = () => {
    setIsCookieClockOpen(() => false)
  }

  const handleOpenCookieClockModal = () => {
    setIsCookieClockOpen(() => true)
  }

  const handleGetCookieClockData = async () => {
    startTransition(async () => {
      try {
        const response = await getCookieClockData()
        const { data } = response

        if (data)
          setCookieClockData({
            start_time: DateTime.fromISO(data.start_time).toISO() || "",
            work_duration: data.work_duration,
            rest_duration: data.rest_duration,
            big_break_frequency: data.big_break_frequency,
            big_break_duration: data.big_break_duration,
            total_cycles: data.total_cycles,
          })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching cookie clock data:", error)
      }
    })
  }

  useEffect(() => {
    handleGetCookieClockData()
  }, [])

  if (isPending || loading)
    return (
      <Loader
        containerHeight="!min-h-fit py-4 lg:py-12"
        className="!bg-neutral-900 !bg-opacity-75 !max-w-[50px] !max-h-[50px] lg:!max-w-[150px] lg:!max-h-[150px]"
      />
    )

  if (cookieClockData === null || cookieClockData === undefined)
    return (
      <div className=" flex flex-col justify-center h-full   ">
        <button
          className="btnPrimary  max-w-[444px] mx-auto w-2/3 py-2"
          onClick={handleOpenCookieClockModal}
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
      <>
        <div className=" flex flex-col justify-between h-full   ">
          <CookieTimer
            cookieClockData={cookieClockData}
            handleSetNewCookieClock={handleOpenCookieClockModal}
            setCookieClockData={setCookieClockData}
          />
        </div>
        <Modal
          handleClose={handleCloseCookieClockModal}
          icon={mdiCookieOutline}
          isOpen={isCookieClockOpen}
          title="Cookie Clock"
          node={cookieClockModalNode}
        >
          {
            <CookieClockModal
              cookieClockData={cookieClockData}
              setCookieClockData={setCookieClockData}
              handleClose={handleCloseCookieClockModal}
            />
          }
        </Modal>
      </>
    )
}
