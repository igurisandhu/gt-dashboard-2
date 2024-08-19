import { useEffect, useState } from 'react';
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
import { AddCompany } from '@app/components/company/addCompany/AddCompany';
import { setCompany } from '@app/store/slices/companySlice';
import { useAppSelector } from '@app/hooks/reduxHooks';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dates } from '@app/constants/Dates';
import * as S from './Style';
import { AddBtn } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentMethod/addNewCard/AddNewCardButton/AddNewCardButton.styles';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { deleteCompany } from '@app/api/company.api';
import { DeleteFilled, DeleteOutlined, DeleteRowOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Companies: React.FC = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddCompanyModal, setIsAddCompanyModal] = useState(false);
  const User = useAppSelector((state) => state.user.user);
  const [editCompany, setEditCompany] = useState<ICompany>();

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
      <BaseModal open={isAddCompanyModal} footer={false} onCancel={hideAddCompanyModal}>
        <AddCompany company={editCompany} hideAddCompanyModal={hideAddCompanyModal} />
      </BaseModal>
      <PageTitle>{t('companies.companies')}</PageTitle>
      <PageHeader title={'Jobs'}>
        <BaseRow align="middle">
          <BaseCol>
            <BaseTooltip showArrow={true} placement="left" title={t('companies.add-company')}>
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

      <BaseRow gutter={[20, 20]} justify="space-between">
        {companies.map((company) => (
          <BaseCol
            onClick={() => selectCompany(company)}
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            xxl={12}
            key={company._id}
          >
            <S.ActivityCard loading={isLoading}>
              <S.Wrapper>
                <S.ImgWrapper>
                  <img
                    src={process.env.REACT_APP_BASE_URL + '' + company.logo}
                    alt={company.name}
                    width={84}
                    height={84}
                  />
                </S.ImgWrapper>
                <S.InfoWrapper>
                  <S.InfoHeaderWrapper>
                    <S.TitleWrapper>
                      <S.Title level={5}>{company.name}</S.Title>

                      <BaseRow>
                        <BaseTooltip showArrow={true} placement="right" title={'Edit Company'}>
                          <EditOutlined
                            style={{ fontSize: '30px', marginLeft: '10px', color: '#1677ff' }}
                            onClick={(event) => {
                              event.stopPropagation();
                              setIsAddCompanyModal(true);
                              setEditCompany(company);
                            }}
                          />
                        </BaseTooltip>

                        <BaseTooltip showArrow={true} placement="right" title={'Delete Company'}>
                          <DeleteOutlined
                            style={{ fontSize: '30px', marginLeft: '10px', color: 'red' }}
                            onClick={(event) => {
                              event.stopPropagation();
                              setIsAddCompanyModal(true);
                              setEditCompany(company);
                            }}
                          />
                        </BaseTooltip>
                      </BaseRow>
                    </S.TitleWrapper>

                    <S.Text>
                      {t(company.name || '')} {t('nft.by')} {User?.name}
                    </S.Text>
                  </S.InfoHeaderWrapper>

                  <S.InfoBottomWrapper>
                    <S.DateText>{Dates.getDate(company.createdAt || Date.now()).format('lll')}</S.DateText>
                  </S.InfoBottomWrapper>
                </S.InfoWrapper>
              </S.Wrapper>
            </S.ActivityCard>
          </BaseCol>
        ))}
      </BaseRow>
    </>
  );
};

export default Companies;
