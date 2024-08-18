import React from 'react';
import * as S from './MoonSunSwitch.styles';
import { MoonIcon } from '@app/components/common/icons/MoonIcon';
import { SunIcon } from '@app/components/common/icons/SunIcon';
import { FacebookIcon } from '@app/components/common/icons/FacebookIcon';
import { ThemeType } from '@app/interfaces/interfaces';

interface MoonSunSwitchProps {
  isMoonActive: boolean;
  selectTheme: (selectedTheme: ThemeType) => void;
}

export const MoonSunSwitch: React.FC<MoonSunSwitchProps> = ({ isMoonActive, selectTheme }) => {
  return (
    <S.ButtonGroup $isFirstActive={isMoonActive}>
      <S.Btn size="small" type="link" icon={<MoonIcon />} onClick={() => selectTheme('dark')} />
      <S.Btn size="small" type="link" icon={<SunIcon />} onClick={() => selectTheme('light')} />
      {/* <S.Btn size="small" type="link" icon={<FacebookIcon />} onClick={() => selectTheme('custom')} /> */}
    </S.ButtonGroup>
  );
};
