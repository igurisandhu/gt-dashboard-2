import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import React, { PropsWithChildren } from 'react';
import * as S from './PageHeader.styles';

interface PageHeaderProps {
  title: string;
}

export const PageHeader: React.FC<PropsWithChildren<PageHeaderProps>> = ({ title, children }) => {
  return (
    <S.WrapperRow justify="space-between">
      <BaseCol>
        <S.Title level={5}>{title}</S.Title>
      </BaseCol>

      {(children && children) || <BaseCol></BaseCol>}
    </S.WrapperRow>
  );
};
