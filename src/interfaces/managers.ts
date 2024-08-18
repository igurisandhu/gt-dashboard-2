export interface IManager {
  _id: string;
  owner_id: string;
  company_id: string;
  name?: string;
  email?: string;
  phone?: number;
  phoneCountryCode?: number;
  country?: string;
  countryCodeAlphabet?: string;
  avatar?: string;
  password?: string;
  isDeleted: boolean;
  isActive: boolean;
  permissions: Permissions;
}

interface PermissionDetail {
  read: boolean;
  write: boolean;
  delete: boolean;
}

interface Permissions {
  [key: string]: PermissionDetail;
}

export interface IManagerEditable {
  name?: string;
  email?: string;
  phone?: number;
  country?: string;
  password?: string;
  _id?: string;
  isActive?: boolean;
  permissions?: Permissions;
  avatar?: string;
}
