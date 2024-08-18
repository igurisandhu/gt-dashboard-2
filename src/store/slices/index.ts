import userReducer from '@app/store/slices/userSlice';
import authReducer from '@app/store/slices/authSlice';
import nightModeReducer from '@app/store/slices/nightModeSlice';
import themeReducer from '@app/store/slices/themeSlice';
import pwaReducer from '@app/store/slices/pwaSlice';
import companyReducer from '@app/store/slices/companySlice';
import { teamReducer, teamsReducer } from '@app/store/slices/teamSlice';
import { agentReducer, agentsReducer } from './agentSlice';

export default {
  user: userReducer,
  auth: authReducer,
  nightMode: nightModeReducer,
  theme: themeReducer,
  pwa: pwaReducer,
  company: companyReducer,
  team: teamReducer,
  teams: teamsReducer,
  agent: agentReducer,
  agents: agentsReducer,
};
