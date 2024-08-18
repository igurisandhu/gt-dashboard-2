import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { WithChildrenProps } from '@app/types/generalTypes';

const RequireAuthWithCompany: React.FC<WithChildrenProps> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);
  const company = useAppSelector((state) => state.company);
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!company) {
    return <Navigate to="/companies" replace />;
  }

  return <>{children}</>;
};

export default RequireAuthWithCompany;
