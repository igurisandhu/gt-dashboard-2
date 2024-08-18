import { UserModel } from '@app/domain/UserModel';
import { ICompany } from '@app/interfaces/companies';
import { IAgent } from '@app/interfaces/agents';
import { ITeam } from '@app/interfaces/teams';

export const persistToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

export const readToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const persistUser = (user: UserModel): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const readUser = (): UserModel | null => {
  const userStr = localStorage.getItem('user');

  return userStr ? JSON.parse(userStr) : null;
};

export const deleteToken = (): void => localStorage.removeItem('accessToken');
export const deleteUser = (): void => localStorage.removeItem('user');

export const persistCompany = (company: ICompany): void => {
  localStorage.setItem('company', JSON.stringify(company));
};

export const readCompany = (): ICompany | null => {
  const companyStr = localStorage.getItem('company');
  return companyStr ? JSON.parse(companyStr) : null;
};

export const deleteCompany = (): void => localStorage.removeItem('company');

export const persistAgent = (agent: IAgent): void => {
  localStorage.setItem('agent', JSON.stringify(agent));
};

export const persistAgents = (agents: IAgent[] | []): void => {
  localStorage.setItem('agents', JSON.stringify(agents));
};

export const readAgent = (): IAgent | null => {
  const agentStr = localStorage.getItem('agent');
  return agentStr ? JSON.parse(agentStr) : null;
};

export const readAgents = (): IAgent[] | [] => {
  const agentStr = localStorage.getItem('agents');
  return agentStr ? JSON.parse(agentStr) : [];
};

export const deleteAgent = (): void => localStorage.removeItem('agent');
export const deleteAgents = (): void => persistAgents([]);

export const persistTeam = (team: ITeam): void => {
  localStorage.setItem('team', JSON.stringify(team));
};

export const persistTeams = (teams: ITeam[]): void => {
  localStorage.setItem('teams', JSON.stringify(teams));
};

export const readTeam = (): ITeam | null => {
  const teamStr = localStorage.getItem('team');
  return teamStr ? JSON.parse(teamStr) : null;
};

export const readTeams = (): ITeam[] | [] => {
  const teamStr = localStorage.getItem('teams');
  return teamStr ? JSON.parse(teamStr) : [];
};

export const deleteTeam = (): void => localStorage.removeItem('team');
export const deleteTeams = (): void => localStorage.removeItem('teams');
