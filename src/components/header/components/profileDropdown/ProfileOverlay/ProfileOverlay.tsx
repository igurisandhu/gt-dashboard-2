import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './ProfileOverlay.styles';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { doChangeCompany } from '@app/store/slices/companySlice';

export const ProfileOverlay: React.FC = ({ ...props }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const Company = useAppSelector((state) => state.company);

  return (
    <div {...props}>
      <S.Text>
        <Link to="/profile">{t('profile.title')}</Link>
      </S.Text>
      <S.ItemsDivider />
      {Company && (
        <S.Text
          onClick={() => {
            dispatch(doChangeCompany());
          }}
        >
          <Link to="/companies">Change Compnay</Link>
        </S.Text>
      )}
      <S.Text>
        <Link to="/logout">{t('header.logout')}</Link>
      </S.Text>
    </div>
  );
};
