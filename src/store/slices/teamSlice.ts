import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { persistTeam, persistTeams, readTeam, readTeams } from '@app/services/localStorage.service';
import { ITeam } from '@app/interfaces/teams';

const initialState: ITeam | null = readTeam();
const initialStateTeams: ITeam[] | [] = readTeams();

export const setTeam = createAction<PrepareAction<ITeam>>('team/setTeam', (newTeam) => {
  persistTeam(newTeam);

  return {
    payload: newTeam,
  };
});

export const setTeams = createAction<PrepareAction<ITeam[]>>('teams/setTeams', (newTeams) => {
  persistTeams(newTeams);

  return {
    payload: newTeams,
  };
});

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setTeam, (state, action) => {
      state = action.payload;
      return state;
    });
  },
});

export const teamsSlice = createSlice({
  name: 'teams',
  initialState: initialStateTeams,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setTeams, (state, action) => {
      state = action.payload;
      return state;
    });
  },
});

export const teamReducer = teamSlice.reducer;
export const teamsReducer = teamsSlice.reducer;
