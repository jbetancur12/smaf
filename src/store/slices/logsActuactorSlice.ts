import { createLogsActuactors, getLogsActuactors } from '@app/api/logsActuactor.api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface LogsActuactorsState {
    logsActuactors: any[]
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  }

const initialState = {
    logsActuactors: [],
    loading: 'idle'
  } as LogsActuactorsState

export const doCreateLogsActuactors = createAsyncThunk(
    'logsActuactors/create',
    async (logsActuactorsData: any) => createLogsActuactors(logsActuactorsData)
)

export const retrieveLogsActuactors = createAsyncThunk(
    'logsActuactors/retrieve',
    async (id:any) => getLogsActuactors(id)    
  )

const logsActuactorSlice = createSlice({
    name: 'logsActuactors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(doCreateLogsActuactors.fulfilled, (state, action) => {
            state.logsActuactors.push(action.payload)
        })
        builder.addCase(retrieveLogsActuactors.fulfilled, (state, action) => {
            return { ...state, logsActuactors: action.payload }
        })
    }
})

export default logsActuactorSlice.reducer

