import authReducer from '@app/store/slices/authSlice'
import controllerReduce from '@app/store/slices/controllerSlice'
import controllerTypeReduce from '@app/store/slices/controllerTypeSlice'
import customerReducer from '@app/store/slices/customerSlice'
import modeReducer from '@app/store/slices/modeSlice'
import parametersControllerReducer from '@app/store/slices/parametersControllerSlice'
import parametersReducer from '@app/store/slices/parametersSlice'
import templateReducer from '@app/store/slices/templateSlice'
import userReducer from '@app/store/slices/userSlice'
import usersReducer from '@app/store/slices/usersSlice'

export default {
  user: userReducer,
  users: usersReducer,
  auth: authReducer,
  mode: modeReducer,
  customer: customerReducer,
  template: templateReducer,
  controller: controllerReduce,
  controllerType: controllerTypeReduce,
  parameters: parametersReducer,
  parametersController: parametersControllerReducer

}
