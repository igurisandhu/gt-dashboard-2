import { useAppSelector } from '@app/hooks/reduxHooks';
import { WithChildrenProps } from '@app/types/generalTypes';
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const PageTitle: React.FC<WithChildrenProps> = ({ children }) => {
  const Company = useAppSelector((state) => state.company);
  return (
    <Helmet>
      <title>
        {children} | {Company?.name}
      </title>
    </Helmet>
  );
};
