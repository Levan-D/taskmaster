/** @format */

import React, { useState, useEffect, useTransition } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { DateTime } from "luxon"
import { setTimer } from "@/app/actions/taskActions"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setModal } from "@/lib/redux/slices/globalSlice"
import Icon from "@mdi/react"
import {
  mdiContentSaveOutline,
  mdiLoading,
  mdiCloseCircleOutline,
  mdiTimerOffOutline,
  mdiChevronDown,
} from "@mdi/js"

type Props = {
  taskId: string
}

export default function Timer({ taskId }: Props) {
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()

  const getRoundedTime = () => {
    const now = DateTime.now()
    const roundedMinutes = Math.ceil(now.minute / 15) * 15
    return now.set({ minute: roundedMinutes }).toJSDate()
  }

  const [startTime, setStartTime] = useState<Date>(getRoundedTime())
  const [endTime, setEndTime] = useState<Date>(
    new Date(startTime.getTime() + 15 * 60 * 1000)
  )

  const handleCloseModal = () => {
    dispatch(setModal({ open: false, type: null, taskId: "" }))
  }

  const handleSetTimer = async () => {
    await setTimer({ taskId: taskId, end_time: endTime, start_time: startTime })
    handleCloseModal()
  }

  const handleResetTimer = async () => {
    await setTimer({ taskId: taskId, end_time: null, start_time: null })
    handleCloseModal()
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentRoundedTime = getRoundedTime()
      if (startTime < currentRoundedTime) {
        setStartTime(currentRoundedTime)
        setEndTime(new Date(currentRoundedTime.getTime() + 15 * 60 * 1000))
      }
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [startTime])

  return (
    <div className="flex flex-col justify-between grow ">
      <div className="flex justify-center gap-8">
        <div>
          {/* Start Time Picker */}
          <DatePicker
            selected={startTime}
            customInput={
              <div className="p-1.5 text-center">
                <p>Start time</p>
                <div className="input mt-4 flex gap-1 items-center  select-none  cursor-pointer">
                  <p> {DateTime.fromJSDate(startTime).toFormat("h:mm a")}</p>
                  <Icon path={mdiChevronDown} size={1} />
                </div>
              </div>
            }
            onChange={(date: Date | null) => {
              if (date) {
                setStartTime(date)
                if (date >= endTime) {
                  setEndTime(new Date(date.getTime() + 15 * 60 * 1000))
                }
              }
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="h:mm aa"
            minTime={new Date()}
            maxTime={new Date(new Date().setHours(23, 45, 0, 0))}
          />

          {/* End Time Picker */}
        </div>

        <div>
          <DatePicker
            selected={endTime}
            customInput={
              <div className="p-1.5 text-center">
                <p>End time</p>
                <div className="input mt-4  select-none flex gap-1 items-center cursor-pointer">
                  <p> {DateTime.fromJSDate(endTime).toFormat("h:mm a")}</p>
                  <Icon path={mdiChevronDown} size={1} />
                </div>
              </div>
            }
            onChange={(date: Date | null) => {
              if (date) setEndTime(date)
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="h:mm aa"
            minTime={new Date(startTime.getTime() + 15 * 60 * 1000)}
            maxTime={new Date(new Date().setHours(23, 45, 0, 0))}
          />
        </div>
      </div>

      <div>
        <button
          disabled={isPending}
          onClick={() => startTransition(handleResetTimer)}
          className="btnSecondary w-full py-2"
        >
          <div
            className={`flex items-center w-fit mx-auto  gap-1 ${
              isPending && "opacity-75"
            } `}
          >
            <Icon
              path={isPending ? mdiLoading : mdiTimerOffOutline}
              size={0.8}
              spin={isPending}
            />
            <p>Remove Timer</p>
          </div>
        </button>
      </div>

      <div className="flex gap-4">
        <button
          disabled={isPending}
          onClick={() => startTransition(handleSetTimer)}
          className="btnPrimary block w-full py-2"
        >
          <div
            className={` ${
              isPending && "opacity-75"
            } flex items-center gap-1 w-fit  mx-auto`}
          >
            <Icon
              path={isPending ? mdiLoading : mdiContentSaveOutline}
              size={0.8}
              spin={isPending}
            />
            <p>Save</p>
          </div>
        </button>
        <button
          disabled={isPending}
          onClick={handleCloseModal}
          className="btnSecondary block w-full py-2"
        >
          <div
            className={` ${
              isPending && "opacity-75"
            } flex items-center gap-1 w-fit  mx-auto`}
          >
            <Icon path={mdiCloseCircleOutline} size={0.8} />
            <p>Close</p>
          </div>
        </button>
      </div>
    </div>
  )
}