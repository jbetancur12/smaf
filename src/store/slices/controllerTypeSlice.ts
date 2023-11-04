import { CreateRequest, create, deleteControllerType, getControllerType, getControllerTypes } from "@app/api/controllerType.api"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface ControllerState {
  controllerTypes: any[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
  controllerTypes: [],
  loading: 'idle'
} as ControllerState

export const doCreateControllerType = createAsyncThunk(
  'controllerType/doCreateControllerType',
  async (createPayload: CreateRequest) => create(createPayload)
)

export const doDeleteControllerType = createAsyncThunk(
  'controllerType/doDeleteControllerType',
  async (controllerTypeId: string) => deleteControllerType(controllerTypeId)
)

export const retrieveControllerTypes = createAsyncThunk(
  'controllerType/retrieveControllerTypes',
  async () => getControllerTypes()
)

export const retrieveControllerType = createAsyncThunk(
  'controllerType/retrieveControllerType',
  async (id:string) => getControllerType(id)
)


const controllerTypeSlice = createSlice({
  name: 'controllerType',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(retrieveControllerTypes.fulfilled, (state, action) => {
      return { ...state, controllerTypes: action.payload }
    })
    builder.addCase(doCreateControllerType.fulfilled, (state, action) => {
      state.controllerTypes.push(action.payload)
    })
    builder.addCase(doDeleteControllerType.fulfilled, (state, action) => {
      const index = state.controllerTypes.findIndex(
        ({ _id }) => _id === action.payload._id
      )
      state.controllerTypes.splice(index, 1)
    })

  }
})

export default controllerTypeSlice.reducer