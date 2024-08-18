import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import * as S from './AddManager.styles';
import { addManager, getManagers } from '@app/api/manager.api';
import { Form, Select } from 'antd';
import countries from '@app/json/countries.json';
import { ITeam } from '@app/interfaces/teams';
import { getTeams } from '@app/api/team.api';
import { IManagerEditable } from '@app/interfaces/managers';

export const AddManager: React.FC<{ hideAddManagerModal: () => void; manager_id?: string }> = ({
  hideAddManagerModal,
  manager_id,
}) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = (values: IManagerEditable) => {
    setLoading(true);
    const data: IManagerEditable = values;
    if (manager_id) {
      data._id = manager_id;
    }
    if (data.phone) {
      data.phone = Number(data.phone);
    }
    addManager(data)
      .then(() => {
        hideAddManagerModal();
      })
      .catch((error) => {
        notificationController.error({ message: error.message });
        hideAddManagerModal();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const GetManager = async () => {
    setLoading(true);
    await getManagers({
      manager_id,
    })
      .then((res) => {
        if (!Array.isArray(res.data)) {
          // Set form values if manager exists
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
    if (manager_id) {
      GetManager();
    }
  }, []);

  return (
    <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
      <S.Title>{manager_id ? t('managers.update-manager') : t('managers.add-manager')}</S.Title>
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

      <Auth.FormItem
        name="country"
        label={t('managers.country')}
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
      <BaseForm.Item>
        <Auth.SubmitButton type="primary" htmlType="submit" loading={loading}>
          {manager_id ? t('managers.update-manager') : t('managers.add-manager')}
        </Auth.SubmitButton>
      </BaseForm.Item>
    </BaseForm>
  );
};
