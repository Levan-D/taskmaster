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

type Step = {
  id: string
  title: string
  isDeleted: boolean
  isComplete: boolean
  creationDate: Date
  taskId: string
}

type Task = {
  id: string
  title: string
  isDeleted: boolean
  isComplete: boolean
  creationDate: Date
  dueDate: Date | null
  priority: TaskPriority
  userId: string
}
