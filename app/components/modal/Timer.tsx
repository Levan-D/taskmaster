/** @format */

import React, { useState, useEffect, useTransition } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { DateTime } from "luxon"
import { setTimer } from "@/app/actions/taskActions"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { setModal } from "@/lib/redux/slices/globalSlice"
import Icon from "@mdi/react"
import {
  mdiContentSaveOutline,
  mdiLoading,
  mdiWindowClose,
  mdiTimerOffOutline,
  mdiChevronDown,
} from "@mdi/js"

export default function Timer() {
  const {
    modal: { selectedTask },
  } = useAppSelector(state => state.global)
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()

  const getRoundedTime = () => {
    return DateTime.now().plus({ minutes: 1 }).toJSDate()
  }

  const [startTime, setStartTime] = useState<Date>(
    selectedTask?.start_time
      ? DateTime.fromISO(selectedTask.start_time).toJSDate()
      : getRoundedTime()
  )
  const [endTime, setEndTime] = useState<Date>(
    selectedTask?.end_time
      ? DateTime.fromISO(selectedTask.end_time).toJSDate()
      : new Date(startTime.getTime() + 5 * 60 * 1000)
  )

  const handleCloseModal = () => {
    dispatch(setModal({ open: false, type: null, selectedTask: null }))
  }

  const handleSetTimer = async () => {
    if (selectedTask)
      await setTimer({
        taskId: selectedTask?.id,
        end_time: endTime,
        start_time: startTime,
      })
    handleCloseModal()
  }

  const handleResetTimer = async () => {
    if (selectedTask)
      await setTimer({
        taskId: selectedTask?.id,
        end_time: null,
        start_time: null,
      })
    handleCloseModal()
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentRoundedTime = getRoundedTime()
      if (startTime < currentRoundedTime) {
        setStartTime(currentRoundedTime)
        setEndTime(new Date(currentRoundedTime.getTime() + 60 * 1000))
      }
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [startTime])

  return (
    <div className="flex flex-col justify-between grow ">
      <div className="flex justify-between gap-2 sm:gap-8 ">
        <div className="   flex flex-col basis-1/2 ">
          {/* Start Time Picker */}
          <DatePicker
            selected={startTime}
            customInput={
              <div className="p-1.5   text-center">
                <p>Start time</p>
                <div className="input justify-center  text-xs sm:text-base mt-4 flex gap-1 items-center  select-none  cursor-pointer">
                  <p> {DateTime.fromJSDate(startTime).toFormat("h:mm a")}</p>
                  <Icon path={mdiChevronDown} size={1} />
                </div>
              </div>
            }
            onChange={(date: Date | null) => {
              if (date) {
                setStartTime(date)
                if (date >= endTime) {
                  setEndTime(new Date(date.getTime() + 60 * 1000))
                }
              }
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={1}
            dateFormat="h:mm aa"
            minTime={new Date()}
            maxTime={new Date(new Date().setHours(23, 58, 0, 0))}
          />

          {/* End Time Picker */}
        </div>

        <div className="basis-1/2 flex flex-col ">
          <DatePicker
            selected={endTime}
            customInput={
              <div className="p-1.5 text-center">
                <p>End time</p>
                <div className="input mt-4 justify-center text-xs sm:text-base select-none flex gap-1 items-center cursor-pointer">
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
            timeIntervals={1}
            dateFormat="h:mm aa"
            minTime={new Date(startTime.getTime() + 60 * 1000)}
            maxTime={new Date(new Date().setHours(23, 59, 0, 0))}
          />
        </div>
      </div>

      <div>
        <button
          disabled={isPending}
          onClick={() => startTransition(handleResetTimer)}
          className="btnSecondary w-full py-3"
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
          className="btnPrimary block w-full py-3"
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
          className="btnSecondary block w-full py-3"
        >
          <div
            className={` ${
              isPending && "opacity-75"
            } flex items-center gap-1 w-fit  mx-auto`}
          >
            <Icon path={mdiWindowClose} size={0.8} />
            <p>Cancel</p>
          </div>
        </button>
      </div>
    </div>
  )
}
