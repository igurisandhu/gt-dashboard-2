import { ICompany } from '@app/interfaces/companies';
import { ICommonResponseFields } from '@app/interfaces/interfaces';
import { httpApi } from './http.api';

//===================Get Companies=================//

interface IGetCompaniesResponse extends ICommonResponseFields {
  data: ICompany | ICompany[];
}

interface IGetCompaniesData {
  limit?: string;
  page?: string;
  name?: string;
  company_id?: string;
}

export const getCompanies = (getCompanyData: IGetCompaniesData): Promise<IGetCompaniesResponse> => {
  const url = 'company';
  return httpApi.get<IGetCompaniesResponse>(url, { params: getCompanyData }).then(({ data }) => data);
};

//===================Add Company=================//

interface IAddCompanyResponse extends ICommonResponseFields {
  data: ICompany;
}

interface IAddCompanyData {
  name: string;
  email: string;
  phone: number;
  website?: string;
  _id?: string;
  isActive?: boolean;
}

export const addCompany = (addCompanyData: IAddCompanyData): Promise<IAddCompanyResponse> => {
  const url = 'company/add';
  return httpApi.post<IAddCompanyResponse>(url, addCompanyData).then(({ data }) => data);
};

export const deleteCompany = (_id: string): Promise<IAddCompanyResponse> => {
  const url = 'company/' + _id;
  return httpApi.delete<IAddCompanyResponse>(url).then(({ data }) => data);
};
