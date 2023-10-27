/** @format */

import React, { useState, useEffect } from "react"
import { DateTime } from "luxon"
import { useAppSelector } from "@/lib/redux/hooks"
import CookieProgress from "./CookieProgress"

export default function CookieTimer() {
  const { cookieClockData } = useAppSelector(state => state.global)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [currentPhase, setCurrentPhase] = useState("Work")

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
        phase = "Work"
        timeLeft = workDurationSecs - timeInCurrentCycle
      } else if (cycleIndex % cookieClockData.big_break_frequency === 0) {
        phase = "Break"
        timeLeft = durations[cycleIndex] * 60 - timeInCurrentCycle
      } else {
        phase = "Rest"
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

  console.log(secondsLeft, currentPhase, currentCycle)
  return (
    cookieClockData && (
      <div>
        <div className="innerContainer mb-6 mt-4 py-1 px-2 ">
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
        <div className="innerContainer my-6  p-2 ">
          <div className="flex   justify-between  items-center gap-1">
            <p className="   "> {currentPhase}</p>
            <p>
              {secondsLeft > 60
                ? `${Math.ceil(secondsLeft / 60)}m`
                : `${String(Math.round(secondsLeft % 60)).padStart(2, "0")}s`}
            </p>
          </div>
        </div>
      </div>
    )
  )
}
