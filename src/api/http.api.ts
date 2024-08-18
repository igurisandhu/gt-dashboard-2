import axios from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from '@app/api/ApiError';
import { readCompany, readToken } from '@app/services/localStorage.service';

export const httpApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

httpApi.interceptors.request.use((config) => {
  config.headers = { ...config.headers, Authorization: `Bearer ${readToken()}` };
  const company_id = readCompany()?._id;
  if (company_id) {
    config.headers = { ...config.headers, company_id };
  }
  return config;
});

httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
  throw new ApiError<ApiErrorData>(error.response?.data.message || error.message, error.response?.data);
});

export interface ApiErrorData {
  message: string;
}
