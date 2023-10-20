/** @format */

import React, { useState, useEffect } from "react"
import { DateTime, Interval, Duration } from "luxon"
import { useAppSelector } from "@/lib/redux/hooks"
import Tooltip from "../../Tooltip"

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
          setCountdown(`${minutes}m:${seconds}s`)
        } else {
          setCountdown(`${hours}h:${minutes}m`)
        }
      }
    }

    updateCountdown()

    const intervalId = setInterval(updateCountdown, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    render && (
      <div
        className={`bg-neutral-700 px-2 rounded-full ${
          windowWidth < 450 && "text-[10px] "
        }`}
      >
        <Tooltip
          text={`ST:${DateTime.fromJSDate(task.start_time || new Date())
            .toLocaleString(DateTime.TIME_SIMPLE)
            .replace(/\s+/g, "")} DR:${
            hoursFromDuration > 0
              ? `${hoursFromDuration}h:${minutesFromDuration}m`
              : `${minutesFromDuration}m`
          }`}
          position="right"
          className="!translate-y-[-24px] text-xs"
        >
          <div className="flex gap-2">
            {windowWidth >= 400 && (
              <>
                {/* If the task hasn't started */}
                {!hasTaskStarted && task.start_time && (
                  <>
                    <div className="flex ">
                      <p> ST:</p>
                      <p>
                        {DateTime.fromJSDate(task.start_time)
                          .toLocaleString(DateTime.TIME_SIMPLE)
                          .replace(/\s+/g, "")}
                      </p>
                    </div>
                    <div className="flex ">
                      <p>DR:</p>
                      <p>
                        {hoursFromDuration > 0
                          ? `${hoursFromDuration}h:${minutesFromDuration}m`
                          : `${minutesFromDuration}m`}
                      </p>
                    </div>
                  </>
                )}

                {/* If the task has started but not ended */}
                {hasTaskStarted && countdown !== "Done" && (
                  <>
                    <div className="flex ">
                      <p>DR:</p>
                      <p>
                        {hoursFromDuration > 0
                          ? `${hoursFromDuration}h:${minutesFromDuration}m`
                          : `${minutesFromDuration}m`}
                      </p>
                    </div>

                    <div className="flex ">
                      <p>CD:</p>
                      <p>{countdown}</p>
                    </div>
                  </>
                )}

                {/* If the task has ended */}
                {countdown === "Done" && (
                  <div className={`flex text-lime-400`}>
                    <p> {countdown}</p>
                  </div>
                )}
              </>
            )}

            {/* If windowWidth is less than 350 */}
            {windowWidth < 400 && (
              <>
                {/* If the task hasn't started */}
                {!hasTaskStarted && task.start_time && (
                  <div className="flex">
                    <p>ST:</p>
                    <p>
                      {DateTime.fromJSDate(task.start_time)
                        .toLocaleString(DateTime.TIME_SIMPLE)
                        .replace(/\s+/g, "")}
                    </p>
                  </div>
                )}

                {/* If the task has started but not ended */}
                {hasTaskStarted && countdown !== "Done" && (
                  <div className="flex">
                    <p>CD:</p>
                    <p>{countdown}</p>
                  </div>
                )}

                {/* If the task has ended */}
                {countdown === "Done" && (
                  <div className={`flex text-lime-400`}>
                    <p> {countdown}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </Tooltip>
      </div>
    )
  )
}
