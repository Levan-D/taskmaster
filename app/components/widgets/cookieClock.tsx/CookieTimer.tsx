/** @format */

import React, { useState, useEffect, useCallback } from "react"
import { DateTime } from "luxon" // Make sure to install luxon or replace with your preferred date library

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"

export default function CookieTimer() {
  const dispatch = useAppDispatch()
  const { cookieClockData } = useAppSelector(state => state.global)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [currentPhase, setCurrentPhase] = useState("work")
  // Calculate the elapsed time in seconds since the start_time
  const calculateElapsedTime = () => {
    if (!cookieClockData || !cookieClockData.start_time) return 0
    const startTime = DateTime.fromISO(cookieClockData.start_time)
    const now = DateTime.now()
    return now.diff(startTime, "seconds").seconds
  }

  // Determine the current phase and cycle based on elapsed time
  const updatePhaseAndCycle = useCallback(() => {
    if (!cookieClockData) return

    let elapsedTime = calculateElapsedTime()

    // Calculate total cycle duration excluding the big break
    const cycleDuration =
      cookieClockData.work_duration * 60 + cookieClockData.rest_duration * 60

    // Determine how many total cycles, including big breaks, have completed
    let totalDurationIncludingBigBreak =
      cycleDuration * cookieClockData.big_break_frequency +
      cookieClockData.big_break_duration * 60
    let cyclesCompleted = Math.floor(elapsedTime / totalDurationIncludingBigBreak)
    elapsedTime -= cyclesCompleted * totalDurationIncludingBigBreak

    // Determine the current cycle and whether it's work time, rest time, or big break
    let cycleWithinBigBreak = Math.floor(elapsedTime / cycleDuration) + 1
    elapsedTime -= (cycleWithinBigBreak - 1) * cycleDuration

    let calculatedCurrentCycle =
      cyclesCompleted * cookieClockData.big_break_frequency + cycleWithinBigBreak

    let isBigBreakDue = cycleWithinBigBreak % cookieClockData.big_break_frequency === 0
    if (isBigBreakDue && elapsedTime >= cookieClockData.work_duration * 60) {
      setCurrentPhase("big_break")
      setSecondsLeft(totalDurationIncludingBigBreak - elapsedTime)
    } else if (!isBigBreakDue && elapsedTime >= cookieClockData.work_duration * 60) {
      setCurrentPhase("rest")
      setSecondsLeft(cycleDuration - elapsedTime)
    } else {
      setCurrentPhase("work")
      setSecondsLeft(cookieClockData.work_duration * 60 - elapsedTime)
    }

    // Correctly calculating the current cycle number
    setCurrentCycle(
      cyclesCompleted * cookieClockData.big_break_frequency + cycleWithinBigBreak
    )

    if (calculatedCurrentCycle > cookieClockData.total_cycles) {
      setCurrentPhase("done")
      setSecondsLeft(0)
    } else {
      setCurrentCycle(calculatedCurrentCycle)
    }
  }, [cookieClockData])

  const calculateEndTime = () => {
    if (!cookieClockData) return ""

    // Total duration of one regular cycle (work + rest)
    const oneCycleDuration = cookieClockData.work_duration + cookieClockData.rest_duration

    // Number of big breaks that will actually occur
    const bigBreaksCount = Math.floor(
      (cookieClockData.total_cycles - 1) / cookieClockData.big_break_frequency
    )

    // Total duration for all cycles, but deducting the rest time for each big break
    const totalDuration =
      cookieClockData.total_cycles * oneCycleDuration -
      bigBreaksCount * cookieClockData.rest_duration +
      bigBreaksCount * cookieClockData.big_break_duration

    // Calculate and format end time
    const endTime = DateTime.fromISO(cookieClockData.start_time)
      .plus({ minutes: totalDuration })
      .toFormat("h:mm a")

    return endTime
  }

  useEffect(() => {
    if (cookieClockData) {
      updatePhaseAndCycle() // Update on initial load
    }
  }, [cookieClockData, updatePhaseAndCycle])

  useEffect(() => {
    const timer =
      secondsLeft > 0 && currentPhase !== "done"
        ? setInterval(() => {
            setSecondsLeft(prevSecondsLeft => prevSecondsLeft - 1)
          }, 1000)
        : undefined

    if (secondsLeft === 0 && currentPhase !== "done") {
      updatePhaseAndCycle()
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [secondsLeft, currentPhase, updatePhaseAndCycle])

  return (
    cookieClockData && (
      <div>
        <p>
          Start Time: {DateTime.fromISO(cookieClockData.start_time).toFormat("h:mm a")}
        </p>
        <p>End Time: {calculateEndTime()}</p>

        <p>Current Phase: {currentPhase}</p>
        <p>
          Time left:
          {secondsLeft > 60
            ? `${Math.floor(secondsLeft / 60)} minutes`
            : `${secondsLeft > 0 ? "0:" : ""}${String(
                Math.round(secondsLeft % 60)
              ).padStart(2, "0")}`}
        </p>

        <p>
          Cycle:
          {currentPhase === "done"
            ? "Done"
            : `${currentCycle}/${cookieClockData.total_cycles}`}
        </p>
      </div>
    )
  )
}
