/** @format */

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface initialStateType {
  todaysOps: undefined | boolean
  weeksOps: undefined | boolean
  windowWidth: number
}

const initialState: initialStateType = {
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
    setWindowWidth: (state, action: PayloadAction<initialStateType["windowWidth"]>) => {
      state.windowWidth = action.payload
    },
    setWeeksOps: (state, action: PayloadAction<initialStateType["weeksOps"]>) => {
      state.weeksOps = action.payload
    },
  },
})

export const { setTodaysOps, setWeeksOps, setWindowWidth } = globalSlice.actions
export default globalSlice.reducer
