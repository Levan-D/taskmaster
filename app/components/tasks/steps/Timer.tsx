/** @format */

import React, { useState, useEffect } from "react"
import { DateTime, Interval, Duration } from "luxon"
import { useAppSelector } from "@/lib/redux/hooks"

type Props = {
  task: Task
}

export default function Timer({ task }: Props) {
  const { windowWidth } = useAppSelector(state => state.global)

  const [countdown, setCountdown] = useState("")
  const [render, setRender] = useState(false)

  const hasTaskStarted =
    task.start_time && DateTime.fromJSDate(task.start_time) <= DateTime.now()
  const duration =
    task.start_time && task.end_time
      ? Duration.fromMillis(task.end_time.getTime() - task.start_time.getTime())
      : null
  const hours = duration ? duration.hours : 0

  const totalMinutesFromDuration = duration ? Math.round(duration.as("minutes")) : 0
  const hoursFromDuration = Math.floor(totalMinutesFromDuration / 60)
  const minutesFromDuration = totalMinutesFromDuration % 60

  useEffect(() => {
    if (!render) setRender(true)
    const updateCountdown = () => {
      if (task.start_time && task.end_time) {
        const now = DateTime.now()
        const startTime = DateTime.fromJSDate(task.start_time)
        const endTime = DateTime.fromJSDate(task.end_time)

        if (now > endTime) {
          setCountdown("Done")
          return
        }

        const duration = Interval.fromDateTimes(now, endTime).toDuration([
          "hours",
          "minutes",
          "seconds",
        ])
        const totalMinutes = Math.round(duration.as("minutes"))
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        const seconds = Math.round(duration.seconds)

        if (duration.as("minutes") < 5) {
          setCountdown(`${minutes}m : ${seconds}s`)
        } else {
          setCountdown(`${hours}h : ${minutes}m`)
        }
      }
    }

    updateCountdown()

    const intervalId = setInterval(updateCountdown, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    render && (
      <div className={`bg-neutral-700 py-0.5 px-2 rounded-full flex`}>
        {task.start_time && (countdown !== "Done" || windowWidth > 640) && (
          <>
            <div className={`flex gap-1 ${hasTaskStarted ? "text-lime-400" : ""}`}>
              <p>ST:</p>
              <p>
                {DateTime.fromJSDate(task.start_time).toLocaleString(
                  DateTime.TIME_SIMPLE
                )}
              </p>
            </div>
          </>
        )}
        {task.start_time && task.end_time && (windowWidth > 640 || !hasTaskStarted) && (
          <div className={`flex gap-1 ${countdown === "Done" ? "text-lime-400" : ""}`}>
            <p>DR: </p>
            <p>
              {hoursFromDuration > 0
                ? `${hoursFromDuration}h : ${minutesFromDuration}m`
                : `${minutesFromDuration}m`}
            </p>
          </div>
        )}

        {hasTaskStarted && (
          <div className={`flex gap-1 ${countdown === "Done" ? "text-lime-400" : ""}`}>
            CD: {countdown}
          </div>
        )}
      </div>
    )
  )
}
