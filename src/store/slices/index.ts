import authReducer from '@app/store/slices/authSlice'
import customerReducer from '@app/store/slices/customerSlice'
import modeReducer from '@app/store/slices/modeSlice'
import userReducer from '@app/store/slices/userSlice'

export default {
  user: userReducer,
  auth: authReducer,
  mode: modeReducer,
  customer: customerReducer,

}
