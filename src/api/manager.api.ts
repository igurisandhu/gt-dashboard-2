import { IManager, IManagerEditable } from '@app/interfaces/managers';
import { ICommonResponseFields } from '@app/interfaces/interfaces';
import { httpApi } from './http.api';

//===================Get Managers=================//

interface IGetManagersResponse extends ICommonResponseFields {
  data: IManager | IManager[];
}

interface IGetManagersData {
  limit?: number;
  page?: number;
  name?: string;
  manager_id?: string;
  email?: string;
  sort?: -1 | 1;
}

export const getManagers = (getManagersData: IGetManagersData): Promise<IGetManagersResponse> => {
  const url = 'manager';
  return httpApi.get<IGetManagersResponse>(url, { params: getManagersData }).then(({ data }) => data);
};

//===================Add Manager=================//

interface IAddManagerResponse extends ICommonResponseFields {
  data: IManager;
}

export const addManager = (addManagerData: IManagerEditable): Promise<IAddManagerResponse> => {
  const url = 'manager/add';
  return httpApi.post<IAddManagerResponse>(url, addManagerData).then(({ data }) => data);
};

//===================Assgin Team=================//

interface IAssignTeamResponse extends ICommonResponseFields {
  data: IManager;
}

interface IAssignTeamManagerData {
  manager_id: string;
  teams: string[];
}

export const assignTeamManager = (assignTeamManagerData: IAssignTeamManagerData): Promise<IAddManagerResponse> => {
  const url = 'manager/assign-team';
  return httpApi.post<IAssignTeamResponse>(url, assignTeamManagerData).then(({ data }) => data);
};

export const deleteManager = (deleteManager: { _id?: string }): Promise<ICommonResponseFields> => {
  const url = 'manager/' + deleteManager._id;
  return httpApi.delete<ICommonResponseFields>(url).then(({ data }) => data);
};
