import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { persistAgent, persistAgents, readAgent, readAgents } from '@app/services/localStorage.service';
import { IAgent } from '@app/interfaces/agents';

const initialState: IAgent | null = readAgent();

export const setAgent = createAction<PrepareAction<IAgent>>('agent/setAgent', (newAgent) => {
  persistAgent(newAgent);

  return {
    payload: newAgent,
  };
});

export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setAgent, (state, action) => {
      state = action.payload;
      return state;
    });
  },
});

const initialStateAgents: IAgent[] | [] = readAgents();

export const setAgents = createAction<PrepareAction<IAgent[]>>('agents/setAgents', (newAgents) => {
  persistAgents(newAgents);

  return {
    payload: newAgents,
  };
});

export const agentsSlice = createSlice({
  name: 'agents',
  initialState: initialStateAgents,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setAgents, (state, action) => {
      state = action.payload;
      return state;
    });
  },
});

export const agentReducer = agentSlice.reducer;
export const agentsReducer = agentsSlice.reducer;
