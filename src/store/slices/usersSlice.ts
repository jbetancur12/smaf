import { deleteUser } from "@app/api/auth.api";
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


export const doDeleteUser = createAsyncThunk(
  'auth/delete',
  async (userId: string) => deleteUser(userId)
)

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(retrieveUsers.fulfilled, (state, action) => {
      return { ...state, users: action.payload }
    })
    builder.addCase(doDeleteUser.fulfilled, (state, action) => {
      const index = state.users.findIndex(
        ({ _id }) => _id === action.payload._id
      )
      state.users.splice(index, 1)
    })
  }
})

export default userSlice.reducer