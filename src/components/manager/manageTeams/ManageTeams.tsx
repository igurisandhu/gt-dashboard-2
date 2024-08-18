import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './ManageTeams.styles';
import { assignTeamManager } from '@app/api/manager.api';
import { Select } from 'antd';
import { getTeams } from '@app/api/team.api';
import { ITeam } from '@app/interfaces/teams';

export const ManageTeams: React.FC<{ manager_id: string }> = ({ manager_id }) => {
  const { t } = useTranslation();

  const [Loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [managerTeams, setManagerTeams] = useState<any[]>([]);

  const GetTeams = (payload: { page?: number; limit?: number; manager_id?: string }) => {
    setLoading(true);
    getTeams(payload)
      .then((res) => {
        if (Array.isArray(res.data)) {
          if (payload.manager_id) {
            setManagerTeams(
              [...res.data.map((item) => ({ ...item, key: item._id }))].filter((team) => team.isActive == true),
            );
          } else {
            setTeams([...res.data.map((item) => ({ ...item, key: item._id }))].filter((team) => team.isActive == true));
          }
        }
      })
      .catch((error) => {
        notificationController.error({ message: error.message });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (values: string) => {
    setLoading(true);
    if (values && values != '' && values != ' ') {
      const team_ids: string[] = values.toString().split(',');
      assignTeamManager({ teams: team_ids, manager_id })
        .then(() => {
          return false;
        })
        .catch((error) => {
          notificationController.error({ message: error.message });
        })
        .finally(() => {
          setLoading(false);
          GetTeams({ manager_id, page: 1, limit: 100 });
          GetTeams({ page: 1, limit: 200 });
        });
    }
  };

  useEffect(() => {
    setTimeout(() => GetTeams({ manager_id, page: 1, limit: 100 }), 500);
    GetTeams({ page: 1, limit: 200 });
  }, [manager_id]);

  return (
    <>
      <S.Title>{t('teams.add-team')}</S.Title>
      <Select
        style={{ width: '100%' }}
        mode="multiple"
        onChange={(values: string) => {
          handleSubmit(values);
        }}
        options={teams.map((team) => ({ label: team.name, value: team._id }))}
        value={managerTeams.map((team: ITeam) => team._id).join(',')}
        showSearch={true}
        loading={Loading}
      ></Select>
    </>
  );
};
