/** @format */

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { DateTime } from "luxon"

interface initialStateType {
  widget: "cookie clock" | null
  todaysOps: undefined | boolean
  weeksOps: undefined | boolean
  windowWidth: number
}

const initialState: initialStateType = {
  widget: null,
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

    setWidget: (state, action: PayloadAction<initialStateType["widget"]>) => {
      state.widget = action.payload
    },

    setWindowWidth: (state, action: PayloadAction<initialStateType["windowWidth"]>) => {
      state.windowWidth = action.payload
    },
    setWeeksOps: (state, action: PayloadAction<initialStateType["weeksOps"]>) => {
      state.weeksOps = action.payload
    },
  },
})

export const { setTodaysOps, setWeeksOps, setWindowWidth, setWidget } =
  globalSlice.actions
export default globalSlice.reducer
