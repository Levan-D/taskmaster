/** @format */

"use client"

import React, { useState, useTransition } from "react"
import Icon from "@mdi/react"
import {
  mdiCheckboxBlankOutline,
  mdiCheckboxOutline,
  mdiLoading,
  mdiContentSaveOutline,
  mdiTrashCanOutline,
  mdiWindowClose,
} from "@mdi/js"
import { updateTaskHabit, deleteTaskHabit } from "@/app/actions/taskActions"

type Props = {
  handleClose: () => void
  task: Task
  addOptimisticTask: (action: Task[]) => void
}

type Radio = {
  Monday: boolean
  Tuesday: boolean
  Wednesday: boolean
  Thursday: boolean
  Friday: boolean
  Saturday: boolean
  Sunday: boolean
}
type RadioKey = keyof Radio

export default function Habit({ handleClose, task, addOptimisticTask }: Props) {
  const defaultState = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  }

  const dayToAbbreviation = (day: RadioKey): DaysAbr => {
    switch (day) {
      case "Monday":
        return "Mon"
      case "Tuesday":
        return "Tue"
      case "Wednesday":
        return "Wed"
      case "Thursday":
        return "Thu"
      case "Friday":
        return "Fri"
      case "Saturday":
        return "Sat"
      case "Sunday":
        return "Sun"
    }
  }

  const updateDefaultState = (task: TaskStringed) => {
    const updatedState = { ...defaultState }

    if (task.repeat && task.repeat.days.length > 0) {
      for (const key in defaultState) {
        const dayAbbreviation = dayToAbbreviation(key as RadioKey)
        if (task.repeat.days.includes(dayAbbreviation)) {
          updatedState[key as RadioKey] = true
        }
      }
    }

    return updatedState
  }

  const [isPending, startTransition] = useTransition()
  const [radio, setRadio] = useState(task ? updateDefaultState(task) : defaultState)

  const onDayChange = (key: string) => {
    setRadio({ ...radio, [key as RadioKey]: !radio[key as RadioKey] })
  }

  const handleCloseModal = () => {
    handleClose()
  }

  const handleDeleteHabit = () => {
    startTransition(async () => {
      try {
        if (task.repeat) {
          addOptimisticTask([{ ...task, repeat: null }])
          await deleteTaskHabit({
            taskId: task.id,
          })
        }
        handleCloseModal()
      } catch (error) {
        console.error("Failed to delete habit:", error)
        handleCloseModal()
      }
    })
  }

  const handleUpdateHabit = () => {
    const selectedDays = Object.keys(radio)
      .filter(key => radio[key as RadioKey])
      .map(key => key.slice(0, 3)) as RepeatType["days"]

    if (selectedDays.length > 0) {
      startTransition(async () => {
        try {
          addOptimisticTask([{ ...task, repeat: { days: selectedDays } }])
          await updateTaskHabit({
            taskId: task.id,
            repeat: { days: selectedDays },
          })
          handleCloseModal()
        } catch (error) {
          console.error("Failed to update habit:", error)
          handleCloseModal()
        }
      })
    } else handleDeleteHabit()
  }

  return (
    <div className="flex flex-col justify-between grow select-none">
      <div className="flex flex-col gap-2 mb-4">
        <p className="text-neutral-300 mb-4  text-xs sm:text-sm">
          Set days on which your task will repeat. Go to habits page to manage your
          repeating tasks. If you delete your repeating task for the day the habit will
          also get deleted.
        </p>

        {Object.keys(radio).map((btn, i) => (
          <div key={i} className="flex justify-between items-center">
            <p> {btn}</p>
            <button
              aria-label={`Toggle ${btn.toLocaleLowerCase()}s habit`}
              onClick={() => onDayChange(btn)}
            >
              <Icon
                className={`${
                  radio[btn as RadioKey] && "!text-indigo-400"
                } text-neutral-500  hover:text-indigo-300 transition-colors duration-300`}
                path={
                  radio[btn as RadioKey] ? mdiCheckboxOutline : mdiCheckboxBlankOutline
                }
                size={1.2}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        aria-label="Delete habit"
        disabled={isPending}
        onClick={handleDeleteHabit}
        className="btnSecondary block w-full py-3 mb-4"
      >
        <div
          className={` ${
            isPending && "opacity-75"
          } flex items-center gap-1 w-fit  mx-auto`}
        >
          <Icon
            path={isPending ? mdiLoading : mdiTrashCanOutline}
            size={0.8}
            spin={isPending}
          />
          <p>Delete Habit</p>
        </div>
      </button>

      <div className="flex gap-4">
        <button
          aria-label="Submit form"
          disabled={isPending}
          onClick={handleUpdateHabit}
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
          aria-label="Cancel and close modal"
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
