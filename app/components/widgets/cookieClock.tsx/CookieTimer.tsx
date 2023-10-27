/** @format */

import React, { useState, useEffect } from "react"
import { DateTime } from "luxon"
import { useAppSelector } from "@/lib/redux/hooks"
import CookieProgress from "./CookieProgress"

export default function CookieTimer() {
  const { cookieClockData } = useAppSelector(state => state.global)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [currentPhase, setCurrentPhase] = useState("work")

  const calculateElapsedTime = () =>
    cookieClockData?.start_time
      ? DateTime.now().diff(DateTime.fromISO(cookieClockData.start_time), "seconds")
          .seconds
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

  const updatePhaseAndCycle = () => {
    if (!cookieClockData) return

    let elapsedTime = calculateElapsedTime()
    const workDurationSecs = cookieClockData.work_duration * 60
    const restDurationSecs = cookieClockData.rest_duration * 60
    const breakDurationSecs = cookieClockData.big_break_duration * 60

    // Calculating the complete cycle duration based on whether it's a big break cycle
    let cycleDuration =
      workDurationSecs +
      (currentCycle % cookieClockData.big_break_frequency === 0
        ? breakDurationSecs
        : restDurationSecs)
    let totalCyclesCompleted = Math.floor(elapsedTime / cycleDuration)
    let timeInCurrentCycle = elapsedTime % cycleDuration

    let phase, timeLeft

    if (totalCyclesCompleted >= cookieClockData.total_cycles) {
      // All cycles complete
      phase = "done"
      timeLeft = 0
    } else if (timeInCurrentCycle < workDurationSecs) {
      // During work
      phase = "work"
      timeLeft = workDurationSecs - timeInCurrentCycle
    } else if (currentCycle % cookieClockData.big_break_frequency === 0) {
      // During big break (no rest in this cycle)
      phase = "big_break"
      timeLeft = breakDurationSecs - (timeInCurrentCycle - workDurationSecs)
    } else {
      // During rest (not a big break cycle)
      phase = "rest"
      timeLeft = restDurationSecs - (timeInCurrentCycle - workDurationSecs)
    }

    // Check and adjust if it's the final work cycle (no break or rest afterwards)
    if (totalCyclesCompleted === cookieClockData.total_cycles - 1 && phase !== "work") {
      phase = "done"
      timeLeft = 0
    }

    setCurrentCycle(totalCyclesCompleted + 1) // Adding 1 to convert from 0-based index
    setCurrentPhase(phase)
    setSecondsLeft(timeLeft)
  }

  useEffect(() => {
    if (cookieClockData) updatePhaseAndCycle()
  }, [cookieClockData])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (currentPhase !== "done") {
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
      <div>
        <CookieProgress
          calculateElapsedTime={calculateElapsedTime}
          calculateTotalDuration={calculateTotalDuration}
          currentCycle={currentCycle}
          currentPhase={currentPhase}
        />
        <p>
          Start Time: {DateTime.fromISO(cookieClockData.start_time).toFormat("h:mm a")}
        </p>
        <p>End Time: {calculateEndTime()}</p>
        <p>Current Phase: {currentPhase}</p>
        <p>
          Time left:{" "}
          {secondsLeft > 60
            ? `${Math.ceil(secondsLeft / 60)}m`
            : `${String(Math.round(secondsLeft % 60)).padStart(2, "0")}s`}
        </p>
        <p>
          Cycle:{" "}
          {currentPhase === "done"
            ? "Done"
            : `${currentCycle}/${cookieClockData.total_cycles}`}
        </p>
      </div>
    )
  )
}
