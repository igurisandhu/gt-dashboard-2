import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseFormItemProps } from '@app/components/common/forms/components/BaseFormItem/BaseFormItem';

interface PhoneItemProps extends BaseFormItemProps {
  verified?: boolean;
  onClick?: () => void;
}

export const PhoneItem: React.FC<PhoneItemProps> = ({ required, onClick, verified, ...props }) => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item
      name="phone"
      $isSuccess={verified}
      $successText={t('profile.nav.personalInfo.verified')}
      label={t('common.phone')}
      rules={[
        { required, message: t('common.requiredField') },
        {
          type: 'number',
          message: t('common.phoneError'),
        },
      ]}
      {...props}
    >
      <BaseInput disabled={verified} onClick={onClick} />
    </BaseButtonsForm.Item>
  );
};
