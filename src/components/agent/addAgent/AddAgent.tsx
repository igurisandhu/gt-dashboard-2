import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import * as S from './AddAgent.styles';
import { addAgent, getAgents } from '@app/api/agent.api';
import { Form, Select } from 'antd';
import countries from '@app/json/countries.json';
import { ITeam } from '@app/interfaces/teams';
import { getTeams } from '@app/api/team.api';
import { IAgentEditable } from '@app/interfaces/agents';
import { SelectTeam } from '@app/components/common/SelectTeam/SelectTeam';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const AddAgent: React.FC<{ hideAddAgentModal: () => void; agent_id?: string }> = ({
  hideAddAgentModal,
  agent_id,
}) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  // const [teams, setTeams] = useState<ITeam[]>([]);
  const [form] = Form.useForm();
  const Team = useAppSelector((state) => state.team);

  const handleSubmit = (values: IAgentEditable) => {
    setLoading(true);
    const data: IAgentEditable = values;
    if (agent_id) {
      data._id = agent_id;
    }
    if (Team) {
      data.team_id = Team._id;
    }
    addAgent(data)
      .then(() => {
        hideAddAgentModal();
      })
      .catch((error) => {
        notificationController.error({ message: error.message });
        hideAddAgentModal();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const GetTeams = async () => {
  //   setLoading(true);
  //   await getTeams({ page: 1, limit: 100 })
  //     .then((res) => {
  //       if (Array.isArray(res.data)) setTeams(res.data);
  //     })
  //     .catch((error) => {
  //       notificationController.error({ message: error.message });
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  const GetAgent = async () => {
    setLoading(true);
    await getAgents({
      agent_id,
    })
      .then((res) => {
        if (!Array.isArray(res.data)) {
          // Set form values if agent exists
          form.setFieldsValue(res.data);
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
    // GetTeams();
    if (agent_id) {
      GetAgent();
    }
  }, []);

  return (
    <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
      <S.Title>{agent_id ? t('agents.update-agent') : t('agents.add-agent')}</S.Title>
      <Auth.FormItem
        name="name"
        label={t('common.name')}
        rules={[{ required: true, message: t('common.requiredField') }]}
      >
        <Auth.FormInput placeholder={t('common.name')} />
      </Auth.FormItem>

      <Auth.FormItem
        name="phone"
        label={t('common.phone')}
        rules={[{ required: true, message: t('common.requiredField') }]}
      >
        <Auth.FormInput type="number" placeholder={t('common.phone')} />
      </Auth.FormItem>

      <Auth.FormItem
        name="email"
        label={t('common.email')}
        rules={[
          { required: true, message: t('common.requiredField') },
          {
            type: 'email',
            message: t('common.notValidEmail'),
          },
        ]}
      >
        <Auth.FormInput placeholder={t('common.email')} />
      </Auth.FormItem>
      <Auth.FormItem
        label={t('common.password')}
        name="password"
        rules={[{ required: true, message: t('common.requiredField') }]}
      >
        <Auth.FormInputPassword placeholder={t('common.password')} />
      </Auth.FormItem>
      {/* <Auth.FormItem
        name="team_id"
        label={t('agents.team_id')}
        rules={[{ required: true, message: t('common.requiredField'), type: 'string' }]}
      > */}
      {/* <Select
          placeholder={t('agents.select-team')}
          options={teams.map((teams) => ({ label: teams.name, value: teams._id }))}
          showSearch={true}
        ></Select> */}
      {/* <SelectTeam />
      </Auth.FormItem> */}
      <Auth.FormItem
        name="country"
        label={t('agents.country')}
        rules={[
          { required: true, message: t('common.requiredField') },
          {
            type: 'string',
            message: t('common.notValidEmail'),
          },
        ]}
      >
        <Select
          placeholder={t('common.select-country')}
          options={countries.map((country) => ({ label: country.name, value: country.name }))}
          showSearch={true}
        ></Select>
      </Auth.FormItem>
      <BaseForm.Item noStyle>
        <Auth.SubmitButton type="primary" htmlType="submit" loading={loading}>
          {agent_id ? t('agents.update-agent') : t('agents.add-agent')}
        </Auth.SubmitButton>
      </BaseForm.Item>
    </BaseForm>
  );
};
