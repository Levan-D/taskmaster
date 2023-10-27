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
    return Math.min((elapsedTime / totalDurationSecs) * 100, 100)
  }

  const calculateCycleDurations = () => {
    let cycleDurations = [];
    for (let i = 1; i <= (cookieClockData?.total_cycles || 0); i++) {
      let duration = cookieClockData?.work_duration || 0;
  
      // Check for big break cycle
      if (i % (cookieClockData?.big_break_frequency || Number.MAX_SAFE_INTEGER) === 0) {
        // Add big break duration
        duration += cookieClockData?.big_break_duration || 0;
      } 
      // Else check for rest duration (if not the last cycle)
      else if (i !== cookieClockData?.total_cycles) {
        duration += cookieClockData?.rest_duration || 0;
      }
  
      cycleDurations.push(duration);
    }
    return cycleDurations;
  };
  

  if (!cookieClockData) return

  const calculateIconPositions = () => {
    let cycleDurations = calculateCycleDurations()
    let totalDuration = calculateTotalDuration()
    let positions = []

    let elapsed = 0
    for (let duration of cycleDurations) {
      elapsed += duration
      // Positioning each cookie at the end of its cycle
      positions.push(elapsed / totalDuration)
    }

    return positions
  }
  console.log(calculateCycleDurations(), calculateTotalDuration())
  return (
    <div className="w-full rounded-full my-6 relative bg-neutral-500">
      <div
        className="h-1 rounded-full bg-lime-400"
        style={{ width: `${calculateProgress()}%` }}
      ></div>
      {calculateIconPositions().map((position, index) => (
        <div
          key={index}
          className="absolute -bottom-3"
          style={{
            left: `calc(${position * 100}% - 29px)`,
          }}
        >
          <Icon
            className={`bg-neutral-800 rounded-full ${
              index < currentCycle - 1 ||
              (index === currentCycle - 1 && currentPhase !== "work")
                ? "text-lime-400"
                : "text-neutral-500"
            }`}
            path={mdiCookie}
            size={1.2}
          />
        </div>
      ))}
    </div>
  )
}
