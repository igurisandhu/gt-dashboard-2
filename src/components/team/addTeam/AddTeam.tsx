import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import * as S from './AddTeam.styles';
import { addTeam } from '@app/api/team.api';

interface IAddTeamFormData {
  name: string;
}

const initValues = {
  name: 'Example Team',
};

export const AddTeam: React.FC<{ hideAddTeamModal: () => void }> = ({ hideAddTeamModal }) => {
  const { t } = useTranslation();

  const [Loading, setLoading] = useState(false);

  const handleSubmit = (values: IAddTeamFormData) => {
    setLoading(true);
    addTeam({ ...values, isActive: true })
      .then(() => {
        hideAddTeamModal();
      })
      .catch((error) => {
        notificationController.error({ message: error.message });
        hideAddTeamModal();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
      <S.Title>{t('teams.add-team')}</S.Title>
      <Auth.FormItem
        name="name"
        label={t('common.name')}
        rules={[{ required: true, message: t('common.requiredField') }]}
      >
        <Auth.FormInput placeholder={t('common.name')} />
      </Auth.FormItem>

      <BaseForm.Item noStyle>
        <Auth.SubmitButton type="primary" htmlType="submit" loading={Loading}>
          {t('teams.add-team')}
        </Auth.SubmitButton>
      </BaseForm.Item>
    </BaseForm>
  );
};
