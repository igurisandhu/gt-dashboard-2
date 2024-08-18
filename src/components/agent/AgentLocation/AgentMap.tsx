import { IAgent } from '@app/interfaces/agents';
import LeafletMaps from '@app/pages/GTMap/LeaftletMaps';
import React from 'react';

const AgentMap: React.FC<{ agent: IAgent }> = ({ agent }) => {
  return <LeafletMaps style={{ width: '100%', height: '60vh' }} key={agent._id} agents={[agent]} />;
};

export default AgentMap;
