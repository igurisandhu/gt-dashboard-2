import React, { useEffect, useState } from 'react';
import { NotificationsDropdown } from '../components/notificationsDropdown/NotificationsDropdown';
import { ProfileDropdown } from '../components/profileDropdown/ProfileDropdown/ProfileDropdown';
// import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import { HeaderFullscreen } from '../components/HeaderFullscreen/HeaderFullscreen';
import * as S from '../Header.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { SelectTeam } from '@app/components/common/SelectTeam/SelectTeam';
import SelectAgent from '@app/components/common/SelectAgent/SelectAgent';
import { ITeam } from '@app/interfaces/teams';
import { useLocation, useParams } from 'react-router-dom';

interface DesktopHeaderProps {
  isTwoColumnsLayout: boolean;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ isTwoColumnsLayout }) => {
  const [selectedTeam, setSelectedTeam] = useState<ITeam>();

  const [selectTeamPaths, setSelectTeamPaths] = useState(['/agents', '/jobs', '/jobs/add']);
  const [selectAgentPaths, setSelectAgentPaths] = useState(['/jobs', '/jobs/add']);

  const pathName = useLocation().pathname;

  const { _id } = useParams();

  useEffect(() => {
    if (_id) {
      setSelectTeamPaths([...selectTeamPaths, '/jobs/add/' + _id]);
      setSelectAgentPaths([...selectTeamPaths, '/jobs/add/' + _id]);
    }
  }, [_id, pathName]);

  const leftSide = isTwoColumnsLayout ? (
    <S.SearchColumn xl={16} xxl={17}>
      <BaseRow justify="space-between">
        <BaseCol xl={15} xxl={12}>
          {/* <HeaderSearch /> */}
        </BaseCol>
        {/* <BaseCol>
          <S.GHButton />
        </BaseCol> */}
      </BaseRow>
    </S.SearchColumn>
  ) : (
    <BaseCol lg={16} xxl={17}>
      <BaseRow>
        {/* <HeaderSearch /> */}
        <BaseCol lg={7} xxl={7}>
          {selectTeamPaths.includes(pathName) ? (
            <SelectTeam
              getSelectedTeam={(team: ITeam) => {
                setSelectedTeam(team);
              }}
              options={{ bordered: false }}
            ></SelectTeam>
          ) : (
            <></>
          )}
        </BaseCol>
        <BaseCol lg={7} xxl={7}>
          {selectAgentPaths.includes(pathName) ? (
            <SelectAgent options={{ bordered: false }} key={selectedTeam ? selectedTeam._id : 2}></SelectAgent>
          ) : (
            <></>
          )}
        </BaseCol>
      </BaseRow>
      {/* <BaseCol lg={10} xxl={8}>
        <HeaderSearch />
      </BaseCol> */}
      {/* <BaseCol>
        <S.GHButton />
      </BaseCol> */}
    </BaseCol>
  );

  return (
    <BaseRow justify="space-between" align="middle">
      {leftSide}

      <S.ProfileColumn xl={8} xxl={7} $isTwoColumnsLayout={isTwoColumnsLayout}>
        <BaseRow align="middle" justify="end" gutter={[5, 5]}>
          <BaseCol>
            <BaseRow gutter={[{ xxl: 5 }, { xxl: 5 }]}>
              <BaseCol>
                <HeaderFullscreen />
              </BaseCol>

              <BaseCol>
                <NotificationsDropdown />
              </BaseCol>

              <BaseCol>
                <SettingsDropdown />
              </BaseCol>
            </BaseRow>
          </BaseCol>

          <BaseCol>
            <ProfileDropdown />
          </BaseCol>
        </BaseRow>
      </S.ProfileColumn>
    </BaseRow>
  );
};
