import React from 'react';
import { useTranslation } from 'react-i18next';
import { IAgent } from '@app/interfaces/agents';
import { Col, Image, Row } from 'antd';
import { Link } from 'react-router-dom';

interface AgentCardProps {
  agent: IAgent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { t } = useTranslation();

  return (
    <Row style={{ width: '200px' }}>
      <Row align="middle" style={{ width: '100%' }}>
        <Col span={7}>
          <Image
            width={'50px'}
            height={'50px'}
            src={`${process.env.REACT_APP_BASE_URL + '/assets/images/owner-avatar.png'}`}
            alt={agent.name}
            preview={false}
          />
        </Col>
        <Col span={17}>
          <p style={{ fontWeight: 'bolder', margin: 0, padding: 0 }}>{agent.name}</p>
        </Col>
        <Col span={24}>
          <p style={{ margin: 0, padding: 0 }}>
            <b>Task Id:</b> <Link to={'/'}>2398483742</Link>
          </p>
        </Col>
        <Col span={24}>
          <p style={{ margin: 0, padding: 0 }}>
            <b>Vechile:</b> Car
          </p>
        </Col>
        <Col span={24}>
          <p style={{ margin: 0, padding: 0 }}>
            <b>Status:</b> offline
          </p>
        </Col>
        <Col span={24}>
          <p style={{ margin: 0, padding: 0 }}>
            <b>Last Seen:</b> 06/11/2023 10:00 PM
          </p>
        </Col>
      </Row>
    </Row>
  );
};
