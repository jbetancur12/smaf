import { httpApi } from '@app/api/http.api';

export interface CreateRequest {
  name: string;
  customer: string
}

export const create = (signUpData: CreateRequest): Promise<undefined> =>
  httpApi
    .post<undefined>('api/controller', { ...signUpData })
    .then(({ data }) => data)

export const deleteController = (
  controllerId: string
): Promise<any> =>
  httpApi
    .delete<any>(`api/controller/${controllerId}`)
    .then(({ data }) => data)