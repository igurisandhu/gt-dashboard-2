import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';
import { addManager, getManagers } from '@app/api/manager.api';
import { Switch } from 'antd';
import * as S from './Style';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import FormItemLabel from 'antd/es/form/FormItemLabel.js';
import { IManagerEditable } from '@app/interfaces/managers.js';

interface PermissionDetail {
  read: boolean;
  write: boolean;
  delete: boolean;
}

interface Permissions {
  [key: string]: PermissionDetail;
}

export const ManagerPermissions: React.FC<{ manager_id?: string }> = ({ manager_id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permissions>({
    job: { read: true, write: false, delete: false },
    agent: { read: true, write: false, delete: false },
    manager: { read: true, write: false, delete: false },
  });

  const [manager, setManager] = useState<IManagerEditable>();

  const handleSubmit = () => {
    setLoading(true);
    addManager({ _id: manager_id, permissions, ...manager })
      .then(() => {
        notificationController.success({ message: 'Manager updated successfully!' });
      })
      .catch((error) => {
        notificationController.error({ message: error.message });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const GetManager = async () => {
    setLoading(true);
    try {
      const res = await getManagers({ manager_id });
      if (!Array.isArray(res.data)) {
        setManager(res.data);
        setPermissions(res.data.permissions || permissions);
      }
    } catch (error: any) {
      notificationController.error({ message: error?.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (manager_id) {
      GetManager();
    }
  }, [manager_id]);

  const handleSwitchChange = (key: string, permission: string, value: boolean) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [key]: {
        ...prevPermissions[key as keyof Permissions],
        [permission]: value,
      },
    }));
    handleSubmit();
  };

  return (
    <>
      <S.Title>{'Permissions'}</S.Title>
      <BaseRow gutter={[10, 10]} justify={'space-around'}>
        {Object.keys(permissions).map((key: string, index: number) => (
          <BaseCard
            loading={loading}
            style={{ width: '30%' }}
            key={index}
            title={`${key[0].toUpperCase() + key.slice(1).toLowerCase()}s`}
          >
            {Object.keys(permissions[key]).map((permission: string, i: number) => (
              <BaseCol key={i} style={{ display: 'flex', justifyContent: 'space-around' }}>
                <FormItemLabel label={permission[0].toUpperCase() + permission.slice(1).toLowerCase()} prefixCls={''} />
                <Switch
                  checked={permissions[String(key) as keyof Permissions][String(permission) as keyof PermissionDetail]}
                  onChange={(value) => handleSwitchChange(key, permission, value)}
                />
              </BaseCol>
            ))}
          </BaseCard>
        ))}
      </BaseRow>
    </>
  );
};
