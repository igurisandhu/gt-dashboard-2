import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { getCompanies } from '@app/api/company.api';
import { ICompany } from '@app/interfaces/companies';
import { notificationController } from '@app/controllers/notificationController';
import { NotFound } from '@app/components/common/NotFound/NotFound';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { PageHeader } from '@app/components/dashboard/common/PageHeader/PageHeader';
import { BaseTooltip } from '@app/components/common/BaseTooltip/BaseTooltip';
import Modal from 'antd/lib/modal/Modal';
import { AddCompany } from '@app/components/company/addCompany/AddCompany';
import { setCompany } from '@app/store/slices/companySlice';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Card } from 'antd';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';

const Companies: React.FC = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddCompanyModal, setIsAddCompanyModal] = useState(false);
  const User = useAppSelector((state) => state.user.user);

  const hideAddCompanyModal = () => {
    setIsAddCompanyModal(false);
    GetCompanies();
  };

  const GetCompanies = () => {
    getCompanies({})
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCompanies(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        notificationController.error({ message: error.message });
        setCompanies([]);
        setIsLoading(false);
      });
  };

  const selectCompany = (company: ICompany) => {
    setCompany(company);
    window.location.href = '/';
  };

  useEffect(() => {
    if (User && User.isManager) {
      selectCompany(User.company_id);
    } else {
      GetCompanies();
    }
  }, [User]);

  return (
    <>
      <BaseModal closable={true} footer={false} onCancel={() => hideAddCompanyModal()} open={isAddCompanyModal}>
        <AddCompany hideAddCompanyModal={hideAddCompanyModal} />
      </BaseModal>
      <PageTitle>{t('common.companies')}</PageTitle>
      <PageHeader title={t('common.companies')}>
        <BaseRow align="middle">
          <BaseCol>
            <BaseTooltip showArrow={true} placement="left" title={t('common.add-company')}>
              <BaseButton
                type="primary"
                color="yellow"
                style={{ fontSize: '40px' }}
                size="small"
                shape="circle"
                onClick={() => setIsAddCompanyModal(true)}
              >
                +
              </BaseButton>
            </BaseTooltip>
          </BaseCol>
        </BaseRow>
      </PageHeader>
      <Card loading={isLoading}>
        <div
          style={{
            width: '70%',
            height: '70%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {companies.map((company, key) => (
            <BaseButton
              style={{ margin: '10px', minWidth: '200px' }}
              key={key}
              onClick={() => selectCompany(company)}
              type="primary"
            >
              {company.name}
            </BaseButton>
          ))}
        </div>
        {companies.length <= 0 ? <NotFound message="No Company Found!" /> : null}
      </Card>
    </>
  );
};

export default Companies;
