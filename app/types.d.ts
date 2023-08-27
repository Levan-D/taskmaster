/** @format */

type DropDownItemJSXType = {
  JSX: JSX.Element
  disabled?: boolean
  invisible?: boolean
}

type DropDownItemActionType = {
  title: string
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
