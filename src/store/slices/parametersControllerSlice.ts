import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Parameters {
  frame1: any[];
  frame2: any[];
  frame3: any[];
}


const initialMqttData: Parameters | null = {
  frame1: [],
  frame2: [],
  frame3: []
}

const parametersControllerSlice = createSlice({
  name: 'parametersControllerSlice',
  initialState: initialMqttData,
  reducers: {
    //@ts-ignore
    setParametersController: (state, action: PayloadAction<any>) => {

      // console.log("🚀 ~ file: parametersControllerSlice.ts:26 ~ action.payload:", action.payload.frame1)
      // if(action.payload.frame1){
      return {...state, ...action.payload}
    // }

    // if(action.payload.frame2 && action.payload.frame2.length > 0){
    //   state.frame2 = action.payload.frame2
    // }

    // if(action.payload.frame3 && action.payload.frame3.length > 0){
    //   state.frame3 = action.payload.frame3
    // }

    },
  },
});


export const { setParametersController } = parametersControllerSlice.actions;
export default parametersControllerSlice.reducer;
