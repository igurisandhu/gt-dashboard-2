import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { persistCompany, readCompany } from '@app/services/localStorage.service';
import { ICompany } from '@app/interfaces/companies';

const initialState: ICompany | null = readCompany();

export const setCompany = createAction<PrepareAction<ICompany>>('company/setCompany', (newCompany) => {
  persistCompany(newCompany);

  return {
    payload: newCompany,
  };
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
  },
});

export default companySlice.reducer;
