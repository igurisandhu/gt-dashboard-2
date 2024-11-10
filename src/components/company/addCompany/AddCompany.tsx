import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import * as S from './AddCompany.styles';
import { addCompany } from '@app/api/company.api';
import { ICompany } from '@app/interfaces/companies';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';

interface IAddCompanyFormData {
  name: string;
  email: string;
  phone: number;
  website?: string;
  _id?: string;
}

const initValues = {
  name: 'Example Company',
  email: 'example-company@yopmail.com',
  website: 'http://example-company.com',
  phone: 919569602213,
};

export const AddCompany: React.FC<{ hideAddCompanyModal: () => void; company: ICompany | undefined }> = ({
  hideAddCompanyModal,
  company,
}) => {
  const { t } = useTranslation();
  const [Form] = BaseForm.useForm();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (values: IAddCompanyFormData) => {
    setIsLoading(true);
    addCompany({ ...values, _id: company?._id })
      .then(() => {
        setIsLoading(false);
        hideAddCompanyModal();
      })
      .catch((error) => {
        notificationController.error({ message: error.message });
        setIsLoading(false);
        hideAddCompanyModal();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (company) {
      Form.setFieldsValue({
        name: company?.name,
        email: company?.email,
        website: company?.website,
        phone: company?.phone,
      });
    }
  }, [company]);

  return (
    <BaseForm form={Form} layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
      <S.Title>{company ? t('common.edit-company') : t('common.add-company')}</S.Title>
      <Auth.FormItem
        name="name"
        label={t('common.name')}
        rules={[{ required: true, message: t('common.requiredField') }]}
      >
        <Auth.FormInput placeholder={t('common.firstName')} />
      </Auth.FormItem>

      <Auth.FormItem name="website" label={t('common.website')} rules={[{ required: false, type: 'url' }]}>
        <Auth.FormInput placeholder={t('common.website')} />
      </Auth.FormItem>

      <Auth.FormItem
        name="phone"
        label={t('common.phone')}
        rules={[{ required: true, message: t('common.requiredField'), type: 'number' }]}
      >
        <Auth.FormInput placeholder={t('common.phone')} />
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
      <Auth.ActionsWrapper>
        <BaseForm.Item name="termOfUse" valuePropName="checked" noStyle>
          <Auth.FormCheckbox>
            <Auth.Text>
              {t('signup.agree')}{' '}
              <Link to="/" target={'_blank'}>
                <Auth.LinkText>{t('signup.termOfUse')}</Auth.LinkText>
              </Link>{' '}
              and{' '}
              <Link to="/" target={'_blank'}>
                <Auth.LinkText>{t('signup.privacyOPolicy')}</Auth.LinkText>
              </Link>
            </Auth.Text>
          </Auth.FormCheckbox>
        </BaseForm.Item>
      </Auth.ActionsWrapper>
      <BaseForm.Item noStyle>
        <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
          {company ? 'Edit Company' : 'Add Company'}
        </Auth.SubmitButton>
      </BaseForm.Item>
    </BaseForm>
  );
};
