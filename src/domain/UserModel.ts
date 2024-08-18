import { ICompany } from '@app/interfaces/companies';

export interface UserModel {
  name: string;
  email: string;
  phone: number;
  phoneCountryCode?: number;
  country?: string;
  countryCodeAlphabet?: string;
  avatar?: string;
  password: string;
  isDeleted: boolean;
  isActive: boolean;
  _id: string;
  Authorization: string;
  isManager: boolean;
  company_id: ICompany;
  website: string;
}
