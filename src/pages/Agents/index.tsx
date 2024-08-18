import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { getAgents, deleteAgent, addAgent } from '@app/api/agent.api';
import { notificationController } from '@app/controllers/notificationController';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';

import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { PageHeader } from '@app/components/dashboard/common/PageHeader/PageHeader';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseTooltip } from '@app/components/common/BaseTooltip/BaseTooltip';
import { IAgent, IAgentEditable } from '@app/interfaces/agents';

import { AddAgent } from '@app/components/agent/addAgent/AddAgent';
import TableSearch from '@app/components/common/TableSearch';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import { ITeam } from '@app/interfaces/teams';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import AgentMap from '@app/components/agent/AgentLocation/AgentMap';
import { Link } from 'react-router-dom';

const Agents: React.FC = () => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState<IAgentEditable[]>([]);
  const [isAddAgentModal, setIsAddAgentModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 5 });
  const [loading, setLoading] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [nameSort, setNameSort] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [total, setTotal] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>(undefined);
  const User = useAppSelector((state) => state.user.user);
  const Team: ITeam | null = useAppSelector((state) => state.team);
  const Agents = useAppSelector((state) => state.agents);
  const [mapAgent, setMapAgent] = useState<IAgent | undefined>();

  const GetAgents = (payload: { page?: number; limit?: number; aganet_id?: string }) => {
    setLoading(true);
    getAgents({
      ...pagination,
      ...payload,
      ...(activeFilter !== null ? { isActive: activeFilter } : {}),
      ...(emailSearch && emailSearch != '' ? { email: emailSearch } : {}),
      ...(nameSearch && nameSearch != '' ? { name: nameSearch } : {}),
      sort: nameSort == 'descend' ? -1 : 1,
      team_id: Team ? Team._id : null,
    })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTableData([
            ...res.data.map((record) => ({
              key: record._id,
              name: record.name,
              password: record.password,
              _id: record._id,
              email: record.email,
              phone: record.phone,
              country: record.country,
              team_id: record.team_id._id,
              isActive: record.isActive,
              team: record.team,
              agentCode: record.agentCode,
            })),
          ]);
          setTotal(res.total);
        }
      })
      .catch((error) => {
        notificationController.error({ message: error.message });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTableChange = (
    Pagination: Record<string, any>,
    filters: Record<string, any>,
    sorterResult: Record<string, any>,
  ) => {
    if (pagination && Pagination?.current != pagination.page) {
      setPagination({ ...pagination, page: Pagination.current || 1 });
    }

    if (sorterResult && sorterResult?.field == 'name' && sorterResult?.order && sorterResult?.order != nameSort) {
      setNameSort(sorterResult.order);
    }

    if (filters && filters?.isActive && filters?.isActive != activeFilter) {
      if (filters?.isActive?.length === 1) {
        setActiveFilter(filters.isActive[0]);
      } else {
        setActiveFilter(null);
      }
    }
  };

  const handleDeleteRow = async (rowId: string) => {
    try {
      setLoading(true);
      await deleteAgent({ _id: rowId });
      setTableData([...tableData.filter((item) => item._id !== rowId)]);
    } catch (errorDeleteAgent) {
      notificationController.error({ message: String(errorDeleteAgent) });
      console.log('errorDeleteAgent:', errorDeleteAgent);
    } finally {
      setLoading(false);
    }
  };

  const changeActiveStatus = async (key: number, isActive: boolean) => {
    try {
      const newData = [...tableData];
      if (key > -1) {
        const item = newData[key];
        newData.splice(key, 1, {
          ...item,
          isActive,
        });
      }
      setTableData(newData);
      setLoading(true);
      await addAgent({ ...newData[key], isActive });
      setLoading(false);
    } catch (errInfo) {
      notificationController.error({ message: String(errInfo) });
      console.log('Validate Failed:', errInfo);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('common.key'),
      dataIndex: 'key',
      width: '5%',
      render: (text: string, record: IAgentEditable, key: number) => {
        return (pagination.page - 1) * pagination.limit + (key + 1);
      },
    },
    {
      title: t('agents.agentCode'),
      dataIndex: 'agentCode',
      width: '10%',
    },
    {
      title: t('agents.name'),
      dataIndex: 'name',
      width: '10%',
      sorter: true,
      ...TableSearch('name', setNameSearch),
      render: (text: string, record: IAgentEditable, key: number) => {
        return (
          <a
            onClick={() => {
              setMapAgent(Agents.filter((agent) => agent._id == record._id)[0]);
            }}
          >
            {record.name}
          </a>
        );
      },
    },
    {
      title: t('agents.email'),
      dataIndex: 'email',
      width: '10%',
      ...TableSearch('email', setEmailSearch),
    },
    {
      title: t('agents.phone'),
      dataIndex: 'phone',
      width: '10%',
    },
    {
      title: t('agents.team'),
      dataIndex: 'team_id',
      width: '10%',
      render: (text: string, record: IAgentEditable, index: number) => {
        return record.team?.name;
      },
    },
    {
      title: t('agents.country'),
      dataIndex: 'country',
      width: '20%',
    },
    {
      title: t('agents.active'),
      dataIndex: 'isActive',
      width: '5%',
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      render: (text: string, record: IAgentEditable, key: number) => {
        return (
          <BaseSwitch
            defaultChecked={record.isActive}
            onChange={(isActive) => {
              changeActiveStatus(key, isActive);
            }}
          />
        );
      },
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '10%',
      render: (text: string, record: IAgentEditable) => {
        return (
          <BaseSpace>
            <BaseButton
              type="ghost"
              onClick={() => {
                setSelectedAgent(record._id);
                setIsAddAgentModal(true);
              }}
            >
              {t('common.edit')}
            </BaseButton>
            <BasePopconfirm title={t('tables.deleteInfo')} onConfirm={() => handleDeleteRow(String(record._id))}>
              <BaseButton type="default" danger>
                {t('tables.delete')}
              </BaseButton>
            </BasePopconfirm>
          </BaseSpace>
        );
      },
    },
  ];

  const hideAddAgentModal = () => {
    setSelectedAgent(undefined);
    setIsAddAgentModal(false);
    GetAgents(pagination);
  };

  useEffect(() => {
    if (User?.isManager) {
      if (Team) {
        GetAgents(pagination);
      }
    } else {
      GetAgents(pagination);
    }
  }, [pagination, nameSearch, emailSearch, nameSort, activeFilter, Team]);

  return (
    <>
      <BaseModal
        width={800}
        footer={false}
        onCancel={() => setMapAgent(undefined)}
        open={mapAgent ? true : false}
        closable={true}
        title="Agent Location"
      >
        {mapAgent && <AgentMap key={mapAgent && mapAgent._id} agent={mapAgent} />}
      </BaseModal>
      <BaseModal closable={true} footer={false} onCancel={() => hideAddAgentModal()} open={isAddAgentModal}>
        <AddAgent key={selectedAgent} agent_id={selectedAgent} hideAddAgentModal={hideAddAgentModal} />
      </BaseModal>
      <PageTitle>{t('agents.agents')}</PageTitle>
      <PageHeader title={t('agents.agents')}>
        <BaseRow align="middle" style={{ width: '30%', justifyContent: 'flex-end' }}>
          <BaseCol>
            <BaseTooltip showArrow={true} placement="left" title={t('agents.add-agent')}>
              <BaseButton
                type="primary"
                color="yellow"
                style={{ fontSize: '40px', marginLeft: '10px' }}
                size="small"
                shape="circle"
                onClick={() => {
                  setIsAddAgentModal(true);
                }}
              >
                +
              </BaseButton>
            </BaseTooltip>
          </BaseCol>
        </BaseRow>
      </PageHeader>
      <BaseTable
        bordered
        dataSource={tableData}
        columns={columns}
        rowClassName="editable-row"
        pagination={{
          pageSize: pagination.limit,
          current: pagination.page,
          total: total,
        }}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 800 }}
      />
    </>
  );
};

export default Agents;
