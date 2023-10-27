/** @format */

import React, { useTransition, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { setModal, setCookieClockData } from "@/lib/redux/slices/globalSlice"
import { createOrUpdateCookieClock } from "@/app/actions/cookieClockActions"
import Icon from "@mdi/react"
import { mdiContentSaveOutline, mdiLoading, mdiWindowClose, mdiRestart } from "@mdi/js"
import { DateTime } from "luxon"
import Tooltip from "../Tooltip"

export default function CookieClock() {
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()
  const { cookieClockData } = useAppSelector(state => state.global)

  const [formValues, setFormValues] = useState(
    cookieClockData
      ? cookieClockData
      : {
          start_time: DateTime.now().toISO() || "",
          work_duration: 25,
          rest_duration: 5,
          big_break_frequency: 3,
          big_break_duration: 30,
          total_cycles: 3,
        }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        await createOrUpdateCookieClock({
          ...formValues,
          start_time: DateTime.now().toISO() || "",
        })
        dispatch(
          setCookieClockData({ ...formValues, start_time: DateTime.now().toISO() || "" })
        )
        handleCloseModal()
      } catch (error) {
        console.error("Error updating cookie clock data:", error)
      }
    })
  }

  const resetCookieClockData = (e: React.FormEvent) => {
    e.preventDefault()

    dispatch(
      setCookieClockData({
        start_time: DateTime.now().toISO() || "",
        work_duration: 25,
        rest_duration: 5,
        big_break_frequency: 4,
        big_break_duration: 30,
        total_cycles: 3,
      })
    )

    setFormValues({
      start_time: DateTime.now().toISO() || "",
      work_duration: 25,
      rest_duration: 5,
      big_break_frequency: 4,
      big_break_duration: 30,
      total_cycles: 3,
    })
  }

  const handleCloseModal = () => {
    dispatch(setModal({ open: false, type: null, taskId: "" }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: Number(e.target.value) })
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name
    let value = Number(e.target.value)

    if (value < 1) value = 1
    if (value > 99) value = 99

    setFormValues({ ...formValues, [name]: value })
  }

  return (
    <div className="flex  grow ">
      <form onSubmit={handleSubmit} className="flex flex-col justify-between grow">
        <div>
          <p className="text-neutral-300 text-sm">
            Cookie Clock is designed to boost your productivity. For best results, set the
            focus for 20-40 minutes & rest for 5-10 minutes. After completing 3-4 work
            cycles, reward yourself with a longer 20-30 minute break.
          </p>
          <p className="text-neutral-300 text-sm mt-1">
            These cycles of focus, rest, & breaks help to maintain your energy and
            concentration levels without exhausting you.
          </p>
        </div>

        <div className="flex flex-col gap-4 my-4">
          <div className="flex justify-end">
            <Tooltip text="Reset to default" position="left">
              <button
                onClick={resetCookieClockData}
                className="btnIcon p-1  text-neutral-300 hover:text-white"
              >
                <Icon path={mdiRestart} size={1} />
              </button>
            </Tooltip>
          </div>
          <div className="flex  items-center justify-between">
            <label>Focus Duration:</label>
            <input
              onBlur={handleBlur}
              min={1}
              max={99}
              className="input w-20 text-center"
              type="number"
              name="work_duration"
              value={formValues.work_duration}
              onChange={handleChange}
            />
          </div>
          <div className="flex  items-center justify-between">
            <label>Rest Duration:</label>
            <input
              onBlur={handleBlur}
              min={1}
              max={99}
              className="input w-20 text-center"
              type="number"
              name="rest_duration"
              value={formValues.rest_duration}
              onChange={handleChange}
            />
          </div>
          <div className="flex  items-center justify-between">
            <label>Break Frequency:</label>
            <input
              onBlur={handleBlur}
              min={1}
              max={99}
              className="input w-20 text-center"
              type="number"
              name="big_break_frequency"
              value={formValues.big_break_frequency}
              onChange={handleChange}
            />
          </div>
          <div className="flex  items-center justify-between">
            <label>Break Duration:</label>
            <input
              onBlur={handleBlur}
              min={1}
              max={99}
              className="input w-20 text-center"
              type="number"
              name="big_break_duration"
              value={formValues.big_break_duration}
              onChange={handleChange}
            />
          </div>
          <div className="flex  items-center justify-between">
            <label>Total Cycles:</label>
            <input
              onBlur={handleBlur}
              min={1}
              max={99}
              className="input w-20 text-center"
              type="number"
              name="total_cycles"
              value={formValues.total_cycles}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            disabled={isPending}
            type="submit"
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
            className="btnSecondary block w-full py-3"
            disabled={isPending}
            onClick={handleCloseModal}
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
      </form>
    </div>
  )
}
