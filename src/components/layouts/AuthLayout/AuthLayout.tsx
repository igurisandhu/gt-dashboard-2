import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import * as S from './AuthLayout.styles';
import { useAppSelector } from '@app/hooks/reduxHooks';

const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, []);
  return (
    <S.Wrapper>
      <S.BackgroundWrapper>
        <S.LoginWrapper>
          <Outlet />
        </S.LoginWrapper>
      </S.BackgroundWrapper>
    </S.Wrapper>
  );
};

export default AuthLayout;
