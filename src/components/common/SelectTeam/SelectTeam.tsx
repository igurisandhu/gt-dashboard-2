import React, { useEffect, useState } from 'react';
import { Select, SelectProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { ITeam } from '@app/interfaces/teams';
import { getTeams } from '@app/api/team.api';
import { notificationController } from '@app/controllers/notificationController';
import { setTeam, setTeams as setTeamsState } from '@app/store/slices/teamSlice';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { deleteAgent } from '@app/services/localStorage.service';
import { setAgent } from '@app/store/slices/agentSlice';

export const SelectTeam: React.FC<{
  getSelectedTeam?: (team: ITeam) => void;
  options?: SelectProps;
}> = ({ getSelectedTeam, options = {} }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const Team = useAppSelector((state) => state.team);

  const dispatch = useAppDispatch();

  const GetTeams = async () => {
    setLoading(true);
    await getTeams({ page: 1, limit: 1000 })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTeams(res.data);
          dispatch(setTeamsState(res.data));
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
    GetTeams();
  }, [Team]);

  return (
    <Select
      placeholder={t('agents.select-team')}
      options={teams.map((teams) => ({ label: teams.name, value: teams._id }))}
      showSearch={true}
      loading={loading}
      value={Team?._id}
      aria-label="Select Team"
      onSelect={(value: string) => {
        if (value) {
          teams.forEach((team) => {
            if (value == team._id) {
              dispatch(setTeam(team));
              if (getSelectedTeam) getSelectedTeam(team);
            }
          });
          deleteAgent();
          dispatch(setAgent(null));
        }
      }}
      {...options}
    ></Select>
  );
};
