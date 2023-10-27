import authReducer from '@app/store/slices/authSlice'
import controllerReduce from '@app/store/slices/controllerSlice'
import customerReducer from '@app/store/slices/customerSlice'
import modeReducer from '@app/store/slices/modeSlice'
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
  controller: controllerReduce

}
