import { ICommonResponseFields } from '@app/interfaces/interfaces';
import { httpApi } from './http.api';

export interface IGetMetricsResponse extends ICommonResponseFields {
  data: Record<string, any>;
}

export const getMetrics = (from: number, to: number): Promise<IGetMetricsResponse> => {
  const url = 'common/metrics';
  return httpApi.get<IGetMetricsResponse>(url, { params: { from, to } }).then(({ data }) => data);
};
