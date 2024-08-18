export interface ITask {
  _id: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  type: 1 | 2;
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  datetime: number;
  address: string;
  name: string;
  phone?: number;
}

export interface ITaskEditable {
  name: string;
  email: string;
  phone: number;
  address: string;
  _id?: string;
  datetime: number;
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  type: 1 | 2;
  location?: {
    type: string;
    coordinates: number[];
  };
}

export interface IJob {
  company_id?: string;
  manager_id?: string;
  team_id?: string;
  agent_id?: string;
  task_id?: ITask[];
  order_id?: number;
  _id?: string;
  isActive?: boolean;
}
