import { httpApi } from '@app/api/http.api';

export interface CreateRequest {
    actuator: string;
    option: string;
    user: string;
    customer: string
}

export const createLogsActuactors = (data: CreateRequest): Promise<any> =>
  httpApi.post<any[]>('api/logs-actuactor', { ...data }).then((res) => res.data)

export const getLogsActuactors = (id: string): Promise<any> =>
  httpApi
    .get<undefined>(`api/logs-actuactor/${id}`)
    .then(({ data }) => data)