/** @format */

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface initialStateType {
  modal: {
    open: boolean
    type: null | "timer"
    taskId: string
  }
  todaysOps: undefined | boolean
  weeksOps: undefined | boolean
  windowWidth: number
}

const initialState: initialStateType = {
  modal: {
    open: false,
    type: null,
    taskId: "",
  },
  todaysOps: undefined,
  weeksOps: undefined,
  windowWidth: 1400,
}

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    resetGlobalState: () => initialState,
    setTodaysOps: (state, action: PayloadAction<initialStateType["todaysOps"]>) => {
      state.todaysOps = action.payload
    },
    setModal: (state, action: PayloadAction<initialStateType["modal"]>) => {
      state.modal = action.payload
    },
    setWindowWidth: (state, action: PayloadAction<initialStateType["windowWidth"]>) => {
      state.windowWidth = action.payload
    },
    setWeeksOps: (state, action: PayloadAction<initialStateType["weeksOps"]>) => {
      state.weeksOps = action.payload
    },
  },
})

export const { setTodaysOps, setWeeksOps, setWindowWidth, setModal } = globalSlice.actions
export default globalSlice.reducer
