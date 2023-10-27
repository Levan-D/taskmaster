/** @format */

import React from "react"
import { useAppSelector } from "@/lib/redux/hooks"
import Icon from "@mdi/react"
import { mdiCookie } from "@mdi/js"

type Props = {
  calculateElapsedTime: () => number
  calculateTotalDuration: () => number
  currentCycle: number
  currentPhase: string
}

export default function CookieProgress({
  calculateElapsedTime,
  calculateTotalDuration,
  currentCycle,
  currentPhase,
}: Props) {
  const { cookieClockData } = useAppSelector(state => state.global)

  const calculateProgress = () => {
    if (!cookieClockData) return ""
    const totalDurationSecs = calculateTotalDuration() * 60
    const elapsedTime = calculateElapsedTime()
    return Math.min(Math.round((elapsedTime / totalDurationSecs) * 100 + 1), 100)
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

  if (!cookieClockData) return

  const calculateIconPositions = () => {
    let cycleDurations = calculateCycleDurations()
    let totalDuration = calculateTotalDuration()
    let positions = []

    let elapsed = 0
    for (let duration of cycleDurations) {
      elapsed += duration
      positions.push(elapsed / totalDuration)
    }

    return positions
  }
  return (
    <div className="w-full  rounded-full mt-3 mb-4 relative bg-neutral-950">
      <div
        className="h-1 rounded-full bg-lime-400"
        style={{ width: `${calculateProgress()}%` }}
      ></div>
      {calculateIconPositions().map((position, index) => (
        <div
          key={index}
          className="absolute -bottom-3"
          style={{
            left: `calc(${position * 100}% - 24px)`,
          }}
        >
          <Icon
            className={`bg-neutral-700 rounded-full ${
              index < currentCycle - 1 ? "text-lime-400" : "text-neutral-950"
            }`}
            path={mdiCookie}
            size={1.2}
          />
        </div>
      ))}
    </div>
  )
}
