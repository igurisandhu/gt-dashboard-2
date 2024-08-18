import { IJob, ITask, ITaskEditable } from '@app/interfaces/tasks';
import { ICommonResponseFields } from '@app/interfaces/interfaces';
import { httpApi } from './http.api';

//===================Get Tasks=================//

interface IGetTasksResponse extends ICommonResponseFields {
  data: IJob | IJob[];
}

interface IGetTasksData {
  limit?: number;
  page?: number;
  name?: string;
  _id?: string;
  sort?: -1 | 1;
  email?: string;
  team_id?: string | null;
  agent_id?: string | null;
}

export const getTasks = (getTasksData: IGetTasksData): Promise<IGetTasksResponse> => {
  const url = 'job';
  return httpApi.get<IGetTasksResponse>(url, { params: getTasksData }).then(({ data }) => data);
};

//===================Add Task=================//

interface IAddTaskResponse extends ICommonResponseFields {
  data: IJob;
}

export const addTask = (addTaskData: IJob): Promise<IAddTaskResponse> => {
  const url = 'job/add';
  return httpApi.post<IAddTaskResponse>(url, addTaskData).then(({ data }) => data);
};

export const deleteTask = (deleteTask: { _id?: string }): Promise<ICommonResponseFields> => {
  const url = 'job/' + deleteTask._id;
  return httpApi.delete<ICommonResponseFields>(url).then(({ data }) => data);
};
