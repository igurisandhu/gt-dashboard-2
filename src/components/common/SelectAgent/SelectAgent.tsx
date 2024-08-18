import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IAgent } from '@app/interfaces/agents';
import { getAgents } from '@app/api/agent.api';
import { notificationController } from '@app/controllers/notificationController';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { Select, SelectProps } from 'antd';
import { setAgent, setAgents as setAgentsState } from '@app/store/slices/agentSlice';

const SelectAgent: React.FC<{ getSelectedAgent?: (agent: IAgent) => void; options: SelectProps }> = ({
  getSelectedAgent,
  options = {},
}) => {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const User = useAppSelector((state) => state.user.user);
  const Team = useAppSelector((state) => state.team);
  const Agent = useAppSelector((state) => state.agent);

  const dispatch = useAppDispatch();

  const GetAgents = (payload: { page?: number; limit?: number; agent_id?: string }) => {
    setLoading(true);
    getAgents({ ...payload, team_id: Team?._id })
      .then((res) => {
        if (Array.isArray(res.data)) {
          dispatch(setAgentsState(res.data));
          setAgents([
            ...res.data.map((record: IAgent) => ({
              key: record._id,
              ...record,
            })),
          ]);
        }
      })
      .catch((error) => {
        notificationController.error({ message: error.message });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (User?.isManager) {
      if (Team) {
        GetAgents({ page: 1, limit: 1000 });
      }
    } else {
      GetAgents({ page: 1, limit: 1000 });
    }
  }, [Team, User, Agent]);

  return (
    <Select
      placeholder={t('agents.select-agent')}
      options={agents.map((agent) => ({ label: agent.name, value: agent._id }))}
      showSearch={true}
      loading={loading}
      value={Agent?._id}
      onChange={(value: string) => {
        if (value) {
          agents.forEach((agent) => {
            if (agent._id == value) {
              if (getSelectedAgent) getSelectedAgent(agent);
              dispatch(setAgent(agent));
            }
          });
        }
      }}
      {...options}
    />
  );
};

export default SelectAgent;
