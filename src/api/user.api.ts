import { httpApi } from '@app/api/http.api'
import { SignUpRequest2 } from './auth.api'

export interface CustomerData {
  name: string
  IdCustomer: string
  email: string
  phone: string
  country: string
  city: string
  address1: string
  createdAt: Date
  users: []
}

export interface CustomerDataResponse extends SignUpRequest2 {
  _id: string
}

export const getUsers = (): Promise<any> =>
  httpApi.get<CustomerDataResponse[]>('api/users').then((res) => res.data)



