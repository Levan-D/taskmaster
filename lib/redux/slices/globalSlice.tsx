/** @format */

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface initialStateType {
  user: {
    loginId: string
  } | null
}

const initialState: initialStateType = {
  user: null,
}

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    resetGlobalState: () => initialState,
    setUser: (state, action: PayloadAction<initialStateType["user"]>) => {
      state.user = action.payload
    },
  },
})

export const { resetGlobalState, setUser } = globalSlice.actions
export default globalSlice.reducer
