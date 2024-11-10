import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { addTask, deleteTask, getTasks } from '@app/api/tasks.api';
import { notificationController } from '@app/controllers/notificationController';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { PageHeader } from '@app/components/dashboard/common/PageHeader/PageHeader';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseTooltip } from '@app/components/common/BaseTooltip/BaseTooltip';
import { IJob, ITask } from '@app/interfaces/tasks';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { IAgent } from '@app/interfaces/agents';
import AgentMap from '@app/components/agent/AgentLocation/AgentMap';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';

const Tasks: React.FC = () => {
  const { t } = useTranslation();
  const [form] = BaseForm.useForm();
  const [tableData, setTableData] = useState<IJob[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5 });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [total, setTotal] = useState(0);
  const Team = useAppSelector((state) => state.team);
  const Agent = useAppSelector((state) => state.agent);
  const Agents = useAppSelector((state) => state.agents);
  const Teams = useAppSelector((state) => state.teams);
  const [mapAgent, setMapAgent] = useState<IAgent | undefined>();

  const GetTasks = (payload: { page?: number; limit?: number; task_id?: string }) => {
    setLoading(true);
    getTasks({
      ...pagination,
      ...payload,
      team_id: Team?._id,
      agent_id: Agent?._id,
      ...(activeFilter !== null ? { isActive: activeFilter } : {}),
    })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTableData([...res.data.map((item) => ({ ...item, key: item._id }))]);
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

    if (filters && filters?.isActive && filters?.isActive != activeFilter) {
      if (filters?.isActive?.length === 1) {
        setActiveFilter(filters.isActive[0]);
      } else {
        setActiveFilter(null);
      }
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
      await addTask({ ...newData[key], isActive });
      setLoading(false);
    } catch (errInfo) {
      notificationController.error({ message: String(errInfo) });
      setLoading(false);
    }
  };

  const handleDeleteRow = async (rowId: string) => {
    try {
      setLoading(true);
      await deleteTask({ _id: rowId });
      setTableData([...tableData.filter((item) => item._id !== rowId)]);
    } catch (errorDeleteTask) {
      console.log('errorDeleteTask:', errorDeleteTask);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetTasks(pagination);
  }, [pagination, activeFilter, Team, Agent]);

  const columns = [
    {
      title: t('common.key'),
      dataIndex: 'key',
      width: '10%',
      sorter: true,
      render: (text: string, record: IJob, key: number) => {
        return (pagination.page - 1) * pagination.limit + (key + 1);
      },
    },
    {
      title: 'Order Id',
      dataIndex: 'order_id',
      width: '15%',
      sorter: true,
      render: (text: string, record: IJob, key: number) => {
        return record.order_id;
      },
    },
    {
      title: 'Total Tasks',
      dataIndex: 'total_tasks',
      width: '10%',
      sorter: true,
      render: (text: string, record: IJob, key: number) => {
        return record.task_id ? record.task_id.length : 0;
      },
    },
    {
      title: 'Team',
      dataIndex: 'team',
      width: '20%',
      // sorter: true,
      render: (text: string, record: IJob, key: number) => {
        return Teams.filter((team) => team._id == record.team_id)[0]?.name;
      },
    },
    {
      title: 'Agent',
      dataIndex: 'agent',
      width: '20%',
      // sorter: true,
      render: (text: string, record: IJob, key: number) => {
        return (
          <a
            onClick={() => {
              setMapAgent(Agents.filter((agent) => agent._id == record.agent_id)[0]);
            }}
          >
            {Agents.filter((agent) => agent._id == record.agent_id)[0]?.name}
          </a>
        );
      },
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '40%',
      render: (text: string, record: ITask) => {
        return (
          <>
            <BaseSpace>
              <Link to={`/jobs/add/${record._id}`}>
                <BaseButton
                  type="ghost"
                  // onClick={() => {
                  //   // location.href = '/jobs/add';
                  // }}
                >
                  {t('common.edit')}
                </BaseButton>
              </Link>
              <BasePopconfirm title={t('tables.deleteInfo')} onConfirm={() => handleDeleteRow(String(record._id))}>
                <BaseButton type="default" danger>
                  {t('tables.delete')}
                </BaseButton>
              </BasePopconfirm>
            </BaseSpace>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    return col;
  });

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
      <PageTitle>Jobs</PageTitle>
      <PageHeader title={'Jobs'}>
        <BaseRow align="middle">
          <BaseCol>
            <BaseTooltip showArrow={true} placement="left" title={t('tasks.add-task')}>
              <Link to={'/jobs/add'}>
                <BaseButton
                  type="primary"
                  color="yellow"
                  style={{ fontSize: '40px' }}
                  size="small"
                  shape="circle"
                  // onClick={() => navigate('/jobs/add')}
                >
                  +
                </BaseButton>
              </Link>
            </BaseTooltip>
          </BaseCol>
        </BaseRow>
      </PageHeader>
      <BaseForm form={form} component={false}>
        <BaseTable
          // components={{
          //   body: {
          //     cell: ,
          //   },
          // }}
          bordered
          dataSource={tableData}
          columns={mergedColumns}
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
      </BaseForm>
    </>
  );
};

export default Tasks;
