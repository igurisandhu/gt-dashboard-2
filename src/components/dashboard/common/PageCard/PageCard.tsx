import React from 'react';
import { BaseCardProps } from '@app/components/common/BaseCard/BaseCard';
import * as S from './PageCard.styles';

interface PageCardProps extends BaseCardProps {
  isSider?: boolean;
}

export const PageCard: React.FC<PageCardProps> = ({ isSider = false, ...props }) => {
  return <S.Card $isSider={isSider} autoHeight={false} padding={[24, 20]} {...props} />;
};
