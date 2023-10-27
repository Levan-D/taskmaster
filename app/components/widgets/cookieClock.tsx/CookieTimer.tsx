/** @format */

import React, { useState, useEffect } from "react"
import { DateTime } from "luxon"
import { useAppSelector } from "@/lib/redux/hooks"
import CookieProgress from "./CookieProgress"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setCookieClockData } from "@/lib/redux/slices/globalSlice"
import Icon from "@mdi/react"
import { mdiPencilOutline, mdiRestart } from "@mdi/js"

type Props = {
  handleSetNewCookieClock: () => void
}

export default function CookieTimer({ handleSetNewCookieClock }: Props) {
  const dispatch = useAppDispatch()
  const { cookieClockData } = useAppSelector(state => state.global)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [currentPhase, setCurrentPhase] = useState("Focus")

  const calculateElapsedTime = () =>
    cookieClockData?.start_time
      ? Math.round(
          DateTime.now().diff(DateTime.fromISO(cookieClockData.start_time), "seconds")
            .seconds
        )
      : 0

  const calculateTotalDuration = (): number => {
    if (!cookieClockData) return 0
    const workDuration = cookieClockData.work_duration * cookieClockData.total_cycles
    const breakFrequency = Math.floor(
      (cookieClockData.total_cycles - 1) / cookieClockData.big_break_frequency
    )
    const restDuration =
      cookieClockData.rest_duration * (cookieClockData.total_cycles - breakFrequency - 1)
    const breakDuration = cookieClockData.big_break_duration * breakFrequency

    return workDuration + restDuration + breakDuration
  }

  const calculateEndTime = () => {
    if (!cookieClockData) return ""

    return DateTime.fromISO(cookieClockData.start_time)
      .plus({ minutes: calculateTotalDuration() })
      .toFormat("h:mm a")
  }

  const calculateCycleDurations = () => {
    let cycleDurations = []
    for (let i = 1; i <= (cookieClockData?.total_cycles || 0); i++) {
      let duration = cookieClockData?.work_duration || 0
      if (i !== cookieClockData?.total_cycles) {
        if (i % (cookieClockData?.big_break_frequency || Number.MAX_SAFE_INTEGER) === 0) {
          duration += cookieClockData?.big_break_duration || 0
        } else {
          duration += cookieClockData?.rest_duration || 0
        }
      }
      cycleDurations.push(duration)
    }
    return cycleDurations
  }

  const resetClock = () => {
    if (cookieClockData)
      dispatch(
        setCookieClockData({
          ...cookieClockData,
          start_time: DateTime.now().toISO() || "",
        })
      )
  }

  const updatePhaseAndCycle = () => {
    if (!cookieClockData) return

    let elapsedTime = calculateElapsedTime()
    const durations = calculateCycleDurations()

    let totalTime = 0
    let cycleIndex
    for (cycleIndex = 0; cycleIndex < durations.length; cycleIndex++) {
      totalTime += durations[cycleIndex] * 60 // Converting minutes to seconds
      if (elapsedTime < totalTime) break
    }

    let phase, timeLeft
    if (cycleIndex >= cookieClockData.total_cycles) {
      phase = "Done"
      timeLeft = 0
    } else {
      let cycleStartTime = totalTime - durations[cycleIndex] * 60
      let timeInCurrentCycle = elapsedTime - cycleStartTime
      let workDurationSecs = cookieClockData.work_duration * 60

      if (timeInCurrentCycle < workDurationSecs) {
        phase = "Focus"
        timeLeft = workDurationSecs - timeInCurrentCycle
      } else {
        // Determine if we are in a "Big Break" phase
        // Consider whether the current cycleIndex + 1 is divisible by big_break_frequency
        if ((cycleIndex + 1) % cookieClockData.big_break_frequency === 0) {
          phase = "Break"
        } else {
          phase = "Rest"
        }
        timeLeft = durations[cycleIndex] * 60 - timeInCurrentCycle
      }
    }

    setCurrentCycle(cycleIndex + 1)
    setCurrentPhase(phase)
    setSecondsLeft(timeLeft)
  }

  useEffect(() => {
    if (cookieClockData) updatePhaseAndCycle()
  }, [cookieClockData])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (currentPhase !== "Done") {
      timer = setInterval(() => {
        setSecondsLeft(prev => {
          const next = Math.max(prev - 1, 0)
          if (next === 0) updatePhaseAndCycle()
          return next
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [currentPhase])

  return (
    cookieClockData && (
      <div className="flex   gap-2 lg:block">
        <div className="innerContainer lg:mb-6 lg:mt-4 py-1 px-2 basis-4/5 sm:basis-3/5 ">
          <p
            className={`${
              currentPhase === "Done" && "text-lime-400"
            } text-right text-xs  text-neutral-300`}
          >
            {currentPhase === "Done"
              ? "Done"
              : `${currentCycle}/${cookieClockData.total_cycles}`}
          </p>
          <CookieProgress
            calculateElapsedTime={calculateElapsedTime}
            calculateTotalDuration={calculateTotalDuration}
            calculateCycleDurations={calculateCycleDurations}
            currentCycle={currentCycle}
          />
          <div className="flex justify-between  text-xs  text-neutral-300 text-center">
            <p>{DateTime.fromISO(cookieClockData.start_time).toFormat("h:mm a")}</p>

            <p>{calculateEndTime()}</p>
          </div>
        </div>
        <div className="innerContainer lg:my-6  p-2 flex items-center basis-1/5  ">
          <div className="sm:flex  text-xs sm:text-base text-center sm:text-start   justify-between w-full items-center gap-1">
            <p className="   "> {currentPhase}</p>
            <p>
              {secondsLeft > 60
                ? `${Math.ceil(secondsLeft / 60)}m`
                : `${String(Math.round(secondsLeft % 60)).padStart(2, "0")}s`}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2  lg:gap-4 sm:basis-1/5">
          {currentPhase === "Done" && (
            <button
              className="btnSecondary px-2 basis-1/2 max-w-[444px] mx-auto w-full py-2"
              onClick={resetClock}
            >
              <div className="flex items-center gap-1 w-fit mx-auto">
                <Icon path={mdiRestart} size={0.7} />
                <p  className=" hidden md:block text-sm " > Reset</p>
              </div>
            </button>
          )}
          <button
            className={`${
              currentPhase === "Done" && "basis-1/2"
            }  btnSecondary px-2 max-w-[444px] mx-auto w-full py-2`}
            onClick={handleSetNewCookieClock}
          >
            <div className="flex items-center gap-1 w-fit mx-auto">
              <Icon path={mdiPencilOutline} size={0.7} />
              <p  className=" hidden md:block text-sm " > Edit</p>
            </div>
          </button>
        </div>
      </div>
    )
  )
}
