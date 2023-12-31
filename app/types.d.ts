/** @format */

type DropDownItemJSXType = {
  JSX: JSX.Element
  disabled?: boolean
  invisible?: boolean
}

type DropDownItemActionType = {
  title: string
  icon?: JSX.Element
  action: () => void
  disabled?: boolean
  invisible?: boolean
}

type DropDownItemBreak = {
  break: boolean
}

type DropDownItemType = (
  | DropDownItemJSXType
  | DropDownItemActionType
  | DropDownItemBreak
)[]

type UserType = {
  given_name: string | null
  id: string | null
  family_name: string | null
  email: string | null
  picture: string | null
}

type TaskPriority = "LOW" | "MEDIUM" | "HIGH"
type Calendar = "Today" | "Tomorrow" | "Next week" | "Custom date"

type Step = {
  id: string
  title: string
  deleted: boolean
  complete: boolean
  creation_date: Date
  taskId: string
  beingDeleted?: boolean
}

type ApiTaskReturn = {
  id: string
  title: string
  deleted: boolean
  complete: boolean
  creation_date: Date
  due_date: Date
  completion_date: Date | null
  start_time: Date | null
  end_time: Date | null
  priority: TaskPriority
  repeat: JsonValue
  user_id: string
  beingDeleted?: boolean
  beingCompleted?: false | "up" | "down"
  steps: Step[] | []
}

type TaskStringed = {
  id: string
  title: string
  deleted: boolean
  complete: boolean
  creation_date: string
  due_date: string
  completion_date: string | null
  start_time: string | null
  end_time: string | null
  priority: TaskPriority
  repeat: null | RepeatType
  user_id: string
  beingDeleted?: boolean
  beingCompleted?: false | "up" | "down"
  steps: Step[] | []
}

type Task = {
  id: string
  title: string
  deleted: boolean
  complete: boolean
  creation_date: DateTime
  due_date: DateTime
  completion_date: DateTime | null
  start_time: DateTime | null
  end_time: DateTime | null
  priority: TaskPriority
  repeat: null | RepeatType
  user_id: string
  beingDeleted?: boolean
  beingCompleted?: false | "up" | "down"
  steps: Step[] | []
}

type RepeatType = {
  days: DaysAbr[]
}

type DaysAbr = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"

type ApiResponse<T> = { success: boolean; data?: T; error?: any }

type DropdownRefType = {
  closeDropdown: () => void
}

type CookieClockType = {
  start_time: string
  work_duration: number
  rest_duration: number
  big_break_frequency: number
  big_break_duration: number
  total_cycles: number
}
