import { frontendURL } from '../../../helper/URLHelper';

import agent from './agents/agent.routes';

import inbox from './inbox/inbox.routes';
import profile from './profile/profile.routes';
import teams from './teams/teams.routes';
import store from '../../../store';

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/settings'),
      name: 'settings_home',
      roles: ['administrator', 'agent'],
      redirect: () => {
        if (store.getters.getCurrentRole === 'administrator') {
          return frontendURL('accounts/:accountId/settings/agents');
        }
        return frontendURL('accounts/:accountId/settings/canned-response');
      },
    },
    ...agent.routes,
    ...inbox.routes,
    ...profile.routes,
    ...teams.routes,
  ],
};
