import { ApiError } from '@app/api/ApiError'
import {
  persistToken,
  readRefreshToken,
  readToken
} from '@app/services/localStorage.service'
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders
} from 'axios'

interface CommonHeaderProperties extends AxiosRequestHeaders {
  'x-access-token': string
}

interface test extends AxiosRequestConfig {
  _retry: boolean
}

export const httpApi = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL
})

httpApi.interceptors.request.use((config) => {
  config.headers = {
    Authorization: `Bearer ${readToken()}`,
    'x-access-token': readToken()
  } as CommonHeaderProperties
  return config
})

httpApi.interceptors.response.use(undefined, async (error: AxiosError) => {

  const originalConfig = error.config as test
  originalConfig._retry = false
  if (originalConfig.url !== 'api/auth/signin' && error.response) {
    if (error.response.status === 401 && !originalConfig._retry) {
      console.log(originalConfig._retry)
      originalConfig._retry = true

      try {
        const rs = await httpApi.post('api/auth/refreshtoken', {
          refreshToken: readRefreshToken()
        })

        console.log(rs)

        const { accessToken } = rs.data

        //dispatch(refreshToken(accessToken));
        persistToken(accessToken)

        return httpApi(originalConfig)
      } catch (_error: any) {
        console.log(_error)
        return Promise.reject(_error)
      }
    } else if (error.response.status === 403) {
      //notificationController.info({message:"Su sesión ha expirado, por favor vuelva a iniciar sesión"});
      window.location.href = '/auth/login'
    }
  }
  if (error.response?.data && typeof error.response.data === 'object') {
    // Si es de tipo ApiErrorData, lanza un ApiError con los datos adecuados
    throw new ApiError<ApiErrorData>(
      // @ts-ignore
      error.response.data.message || error.message,
      error.response.data as ApiErrorData
    );
  } else {
    // Si no es de tipo ApiErrorData, lanza un ApiError con un mensaje genérico o undefined para los datos
    throw new ApiError<ApiErrorData>(error.message, undefined);
  }
})

export interface ApiErrorData {
  message: string
}
