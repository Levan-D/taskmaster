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

type Task = {
  id: string
  title: string
  deleted: boolean
  complete: boolean
  creation_date: Date
  due_date: string
  start_time: Date | null
  end_time: Date | null
  priority: TaskPriority
  user_id: string
  beingDeleted?: boolean
  beingCompleted?: false | "up" | "down"
  steps: Step[] | []
}

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
