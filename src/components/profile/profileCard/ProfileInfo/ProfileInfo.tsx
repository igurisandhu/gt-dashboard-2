import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserModel } from '@app/domain/UserModel';
import * as S from './ProfileInfo.styles';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';

interface ProfileInfoProps {
  profileData: UserModel | null;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profileData }) => {
  return profileData ? (
    <S.Wrapper>
      <BaseRow style={{ justifyContent: 'center', alignItems: 'center' }}>
        <BaseAvatar
          src={process.env.REACT_APP_BASE_URL + '' + profileData?.avatar}
          alt="Profile"
          shape="circle"
          size={100}
        />
      </BaseRow>
      <S.Title>{`${profileData?.name}`}</S.Title>
      {/* <S.Subtitle>{profileData?.name}</S.Subtitle> */}
    </S.Wrapper>
  ) : null;
};
