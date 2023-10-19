import { getUsers } from "@app/api/user.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserState {
  users: any[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
  users: [],
  loading: 'idle'
} as UserState

export const retrieveUsers = createAsyncThunk(
  'users/retrieve',
  async () => getUsers()
)

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(retrieveUsers.fulfilled, (state, action) => {
      return { ...state, users: action.payload }
    })
  }
})

export default userSlice.reducer