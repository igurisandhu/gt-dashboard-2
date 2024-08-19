import React, { useEffect, useState } from 'react';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { SelectTeam } from '@app/components/common/SelectTeam/SelectTeam';
import SelectAgent from '@app/components/common/SelectAgent/SelectAgent';
import { ITeam } from '@app/interfaces/teams';
import { useLocation, useParams } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';

export const DefaultSelect: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<ITeam>();

  const [selectTeamPaths, setSelectTeamPaths] = useState(['/agents', '/jobs', '/jobs/add']);
  const [selectAgentPaths, setSelectAgentPaths] = useState(['/jobs', '/jobs/add']);

  const pathName = useLocation().pathname;

  const { isTablet } = useResponsive();

  const { _id } = useParams();

  useEffect(() => {
    if (_id) {
      setSelectTeamPaths([...selectTeamPaths, '/jobs/add/' + _id]);
      setSelectAgentPaths([...selectTeamPaths, '/jobs/add/' + _id]);
    }
  }, [_id, pathName]);

  return (
    <BaseCol xl={isTablet ? 16 : 24} xxl={isTablet ? 17 : 24}>
      <BaseRow gutter={[10, 10]}>
        {/* <HeaderSearch /> */}
        <BaseCol xl={isTablet ? 7 : 24} xxl={isTablet ? 7 : 12}>
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
        <BaseCol xl={isTablet ? 7 : 24} xxl={isTablet ? 7 : 12}>
          {selectAgentPaths.includes(pathName) ? (
            <SelectAgent options={{ bordered: false }} key={selectedTeam ? selectedTeam._id : 2}></SelectAgent>
          ) : (
            <></>
          )}
        </BaseCol>
      </BaseRow>
    </BaseCol>
  );
};
