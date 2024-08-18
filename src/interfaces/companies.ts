export interface ICompany {
  owner_id: string;
  name: string;
  email: string;
  phone: number;
  phoneCountryCode?: number;
  country?: string;
  countryCodeAlphabet: string;
  logo?: string;
  website?: string;
  isDeleted: boolean;
  isActive: boolean;
  _id: string;
}
