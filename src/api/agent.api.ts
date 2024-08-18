import { IAgent, IAgentEditable } from '@app/interfaces/agents';
import { ICommonResponseFields } from '@app/interfaces/interfaces';
import { httpApi } from './http.api';

//===================Get Agents=================//

interface IGetAgentsResponse extends ICommonResponseFields {
  data: IAgent | IAgent[];
}

interface IGetAgentsData {
  limit?: number;
  page?: number;
  name?: string;
  agent_id?: string;
  sort?: -1 | 1;
  email?: string;
  team_id?: string | null;
}

export const getAgents = (getAgentsData: IGetAgentsData): Promise<IGetAgentsResponse> => {
  const url = 'agent';
  return httpApi.get<IGetAgentsResponse>(url, { params: getAgentsData }).then(({ data }) => data);
};

//===================Add Agent=================//

interface IAddAgentResponse extends ICommonResponseFields {
  data: IAgent;
}

export const addAgent = (addAgentData: IAgentEditable): Promise<IAddAgentResponse> => {
  const url = 'agent/add';
  return httpApi.post<IAddAgentResponse>(url, addAgentData).then(({ data }) => data);
};

export const deleteAgent = (deleteAgent: { _id?: string }): Promise<ICommonResponseFields> => {
  const url = 'agent/' + deleteAgent._id;
  return httpApi.delete<ICommonResponseFields>(url).then(({ data }) => data);
};
