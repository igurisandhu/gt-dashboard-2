import { createAction, createSlice, PrepareAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteAgent,
  deleteAgents,
  deleteCompany,
  deleteTeam,
  deleteTeams,
  persistCompany,
  readCompany,
} from '@app/services/localStorage.service';
import { ICompany } from '@app/interfaces/companies';
import { setTeam, setTeams } from './teamSlice';
import { setAgent, setAgents } from './agentSlice';

const initialState: ICompany | null = readCompany();

export const setCompany = createAction<PrepareAction<ICompany>>('company/setCompany', (newCompany) => {
  persistCompany(newCompany);

  return {
    payload: newCompany,
  };
});

export const doChangeCompany = createAsyncThunk('auth/doLogout', (payload, { dispatch }) => {
  deleteCompany();
  deleteAgent();
  deleteTeam();
  deleteTeams();
  deleteAgents();
  dispatch(setTeam(null));
  dispatch(setTeams([]));
  dispatch(setCompany(null));
  dispatch(setAgent(null));
  dispatch(setAgents([]));
});

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setCompany, (state, action) => {
      state = action.payload;
      return state;
    });
    builder.addCase(doChangeCompany.fulfilled, (state) => {
      state = null;
      return state;
    });
  },
});

export default companySlice.reducer;
