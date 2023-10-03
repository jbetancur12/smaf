import { PrepareAction, createAction, createSlice } from "@reduxjs/toolkit";


export interface ModeState {
  mode: 'light' | 'dark'
}

export type ModeType = 'light' | 'dark'

const initialState: ModeState = {
  mode: 'light'
}

export const setmode= createAction<PrepareAction<ModeType>>(
  'mode/setMode',
  (mode: ModeType) => {
    localStorage.setItem('mode', mode)
    return {
      payload: mode
    }
  }
)


export const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
})

export default modeSlice.reducer