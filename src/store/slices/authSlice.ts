import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ResetPasswordRequest,
  login,
  LoginRequest,
  signUp,
  SignUpRequest,
  resetPassword,
  verifySecurityCode,
  SecurityCodePayload,
  NewPasswordData,
  setNewPassword,
} from '@app/api/auth.api';
import { setUser } from '@app/store/slices/userSlice';
import {
  deleteToken,
  deleteUser,
  persistToken,
  readToken,
  deleteCompany,
  deleteAgent,
  deleteTeam,
  deleteAgents,
  deleteTeams,
} from '@app/services/localStorage.service';
import { setCompany } from './companySlice';
import { setAgent, setAgents } from './agentSlice';
import { setTeam, setTeams } from './teamSlice';

export interface AuthSlice {
  token: string | null;
}

const initialState: AuthSlice = {
  token: readToken(),
};

export const doLogin = createAsyncThunk('auth/doLogin', async (loginPayload: LoginRequest, { dispatch }) =>
  login(loginPayload).then(async (res) => {
    dispatch(setUser(res.data));
    persistToken(res.data.Authorization);
    if (res.data.isManager) {
      await setCompany(res.data.company_id);
    }
    return res.data.Authorization;
  }),
);

export const doSignUp = createAsyncThunk('auth/doSignUp', async (signUpPayload: SignUpRequest, { dispatch }) =>
  signUp(signUpPayload).then((res) => {
    dispatch(setUser(res.data));
    persistToken(res.data.Authorization);

    return res.data.Authorization;
  }),
);

export const doResetPassword = createAsyncThunk(
  'auth/doResetPassword',
  async (resetPassPayload: ResetPasswordRequest) => resetPassword(resetPassPayload),
);

export const doVerifySecurityCode = createAsyncThunk(
  'auth/doVerifySecurityCode',
  async (securityCodePayload: SecurityCodePayload) => verifySecurityCode(securityCodePayload),
);

export const doSetNewPassword = createAsyncThunk('auth/doSetNewPassword', async (newPasswordData: NewPasswordData) =>
  setNewPassword(newPasswordData),
);

export const doLogout = createAsyncThunk('auth/doLogout', (payload, { dispatch }) => {
  deleteToken();
  deleteUser();
  deleteCompany();
  deleteAgent();
  deleteTeam();
  deleteTeams();
  deleteAgents();
  dispatch(setTeam(null));
  dispatch(setTeams([]));
  dispatch(setUser(null));
  dispatch(setCompany(null));
  dispatch(setAgent(null));
  dispatch(setAgents([]));
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, (state, action) => {
      state.token = action.payload;
    });
    builder.addCase(doLogout.fulfilled, (state) => {
      state.token = '';
    });
    builder.addCase(doSignUp.fulfilled, (state, action) => {
      state.token = action.payload;
    });
  },
});

export default authSlice.reducer;
