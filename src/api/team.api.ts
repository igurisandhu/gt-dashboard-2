import { ITeam } from '@app/interfaces/teams';
import { ICommonResponseFields } from '@app/interfaces/interfaces';
import { httpApi } from './http.api';

//===================Get Teams=================//

interface IGetTeamsResponse extends ICommonResponseFields {
  data: ITeam | ITeam[];
}

interface IGetTeamsData {
  limit?: number;
  page?: number;
  name?: string;
  team_id?: string;
  manager_id?: string;
  sort?: -1 | 1;
  isActive?: boolean;
}

export const getTeams = (getTeamsData: IGetTeamsData): Promise<IGetTeamsResponse> => {
  const url = 'team';
  return httpApi.get<IGetTeamsResponse>(url, { params: getTeamsData }).then(({ data }) => data);
};

//===================Add Team=================//

interface IAddTeamResponse extends ICommonResponseFields {
  data: ITeam;
}

export const addTeam = (addTeamData: { name: string; _id?: string; isActive: boolean }): Promise<IAddTeamResponse> => {
  const url = 'team/add';
  return httpApi.post<IAddTeamResponse>(url, addTeamData).then(({ data }) => data);
};

export const deleteTeam = (deleteTeam: { _id?: string }): Promise<ICommonResponseFields> => {
  const url = 'team/' + deleteTeam._id;
  return httpApi.delete<ICommonResponseFields>(url).then(({ data }) => data);
};
