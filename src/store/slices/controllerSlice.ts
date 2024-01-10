import { CreateRequest, create, deleteController, getControllers } from "@app/api/controller.api"
import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface ControllerState {
  controllers: any[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
  controllers: [],
  loading: 'idle'
} as ControllerState

export const doCreateController = createAsyncThunk(
  'controller/doCreateController',
  async (createPayload: CreateRequest) => create(createPayload)
)

export const doDeleteController = createAsyncThunk(
  'controller/delete',
  async (controllerId: string) => deleteController(controllerId)
)

export const retrieveControllers = createAsyncThunk(
  'controllers/retrieve',
  async () => getControllers()
)



const controllerSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // setController: (state, action: PayloadAction<any>) => {




    // },
        setController: () => {




    },
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveControllers.fulfilled, (state, action) => {
      return { ...state, controllers: action.payload }
    })
    builder.addCase(doCreateController.fulfilled, (state, action) => {
      state.controllers.push(action.payload)
    })
    builder.addCase(doDeleteController.fulfilled, (state, action) => {
      const index = state.controllers.findIndex(
        ({ _id }) => _id === action.payload._id
      )
      state.controllers.splice(index, 1)
    })

  }
})



export const { setController } = controllerSlice.actions;

export default controllerSlice.reducer