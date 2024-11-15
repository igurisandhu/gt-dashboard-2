import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { FONT_SIZE, media } from '@app/styles/themes/constants';
import styled from 'styled-components';

export const WrapperRow = styled(BaseRow)`
  margin-top: 1rem;
  margin-bottom: 1rem;

  @media only screen and ${media.xl} {
    margin-bottom: 2rem;
  }
`;

export const Title = styled(BaseTypography.Title)`
  &.ant-typography {
    margin-bottom: 0;

    font-size: ${FONT_SIZE.md};

    @media only screen and ${media.xl} {
      font-size: ${FONT_SIZE.lg};
    }
  }
`;
