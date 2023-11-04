import { httpApi } from '@app/api/http.api';

export interface CreateRequest {
  name: string;
}

export const getControllerTypes = (): Promise<any> =>
  httpApi.get<any[]>('api/controllerType').then((res) => res.data)

export const getControllerType = (id: any):
  Promise<any> =>
  httpApi
    .get<any>(`api/controllerType/${id}`)
    .then((res) => res.data)

export const create = (data: CreateRequest): Promise<undefined> =>
  httpApi
    .post<undefined>('api/controllerType', { ...data })
    .then(({ data }) => data)

export const deleteControllerType = (
  controllerTypeId: string
): Promise<any> =>
  httpApi
    .delete<any>(`api/controllerType/${controllerTypeId}`)
    .then(({ data }) => data)