/** @format */

import { DateTime } from "luxon"

export function getRelativeDateString(due_date: string) {
  const dueDate = DateTime.fromISO(due_date).startOf("day")
  const now = DateTime.now().startOf("day")
  const diffInDays = dueDate.diff(now, "days").days

  if (dueDate.hasSame(now, "day")) {
    return "Today"
  } else if (dueDate.plus({ days: 1 }).hasSame(now, "day")) {
    return "Yesterday"
  } else if (diffInDays >= 0 && diffInDays <= 6) {
    return dueDate.toFormat("cccc")
  } else if (diffInDays > 6 && diffInDays <= 13) {
    return "Next " + dueDate.toFormat("cccc")
  } else {
    return dueDate.toFormat("dd/MM/yy")
  }
}

export function getOrdinalSuffix(day: number) {
  if (day % 10 === 1 && day !== 11) {
    return `st`
  } else if (day % 10 === 2 && day !== 12) {
    return `nd`
  } else if (day % 10 === 3 && day !== 13) {
    return `rd`
  } else {
    return `th`
  }
}
