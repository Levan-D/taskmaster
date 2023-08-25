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
  