import { ITeam } from './teams';

export interface IAgent {
  _id: string;
  owner_id: string;
  company_id: string;
  team_id: {
    _id: string;
    name: string;
  };
  name?: string;
  email?: string;
  phone?: number;
  phoneCountryCode?: number;
  country?: string;
  countryCodeAlphabet?: string;
  avatar?: string;
  password?: string;
  agentCode: string;
  isDeleted: boolean;
  isActive: boolean;
  team?: ITeam;
  location: {
    type: string;
    coordinates: number[];
  };
}

export interface IAgentEditable {
  name?: string;
  email?: string;
  phone?: number;
  country?: string;
  password?: string;
  _id?: string;
  team_id?: string;
  isActive?: boolean;
  team?: ITeam;
}
