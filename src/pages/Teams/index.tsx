import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { addTeam, deleteTeam, getTeams } from '@app/api/team.api';
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
import { ITeam } from '@app/interfaces/teams';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { AddTeam } from '@app/components/team/addTeam/AddTeam';
import TableSearch from '@app/components/common/TableSearch';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { setTeam, setTeams } from '@app/store/slices/teamSlice';
import { useDispatch } from 'react-redux';
import { Switch } from 'antd';

const EditableCell: React.FC<any> = ({
  editing,
  dataIndex,
  title,
  inputNode,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <BaseForm.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please input ${title}!` }]}
        >
          {inputNode}
        </BaseForm.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Teams: React.FC = () => {
  const { t } = useTranslation();
  const [editingKey, setEditingKey] = useState('');
  const [form] = BaseForm.useForm();
  const [tableData, setTableData] = useState<ITeam[]>([]);
  const [isAddTeamModal, setIsAddTeamModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 5 });
  const [loading, setLoading] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [nameSort, setNameSort] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();

  const GetTeams = (payload: { page?: number; limit?: number; team_id?: string }) => {
    setLoading(true);
    getTeams({
      ...pagination,
      ...payload,
      ...(activeFilter !== null ? { isActive: activeFilter } : {}),
      ...(nameSearch && nameSearch != '' ? { name: nameSearch } : {}),
      sort: nameSort == 'descend' ? -1 : 1,
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

  const handleNameSearch = (search: string) => {
    setNameSearch(search);
  };

  const isEditing = (record: ITeam) => String(record._id) === editingKey;

  const edit = (record: ITeam) => {
    form.setFieldsValue({ ...record });
    setEditingKey(String(record._id));
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      setLoading(true);
      const row = (await form.validateFields()) as ITeam;

      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      }
      setTableData(newData);
      setEditingKey('');
      await addTeam({ ...newData[index], ...row });
    } catch (errorSaveTeam) {
      console.log('errorSaveTeam:', errorSaveTeam);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRow = async (rowId: string) => {
    try {
      setLoading(true);
      await deleteTeam({ _id: rowId });
      setTableData([...tableData.filter((item) => item._id !== rowId)]);
      dispatch(setTeams([]));
      dispatch(setTeam(null));
    } catch (errorDeleteTeam) {
      console.log('errorDeleteTeam:', errorDeleteTeam);
    } finally {
      setLoading(false);
    }
  };

  const hideAddTeamModal = () => {
    setIsAddTeamModal(false);
    GetTeams(pagination);
  };

  useEffect(() => {
    GetTeams(pagination);
  }, [pagination, nameSearch, nameSort, activeFilter]);

  const columns = [
    {
      title: t('common.key'),
      dataIndex: 'key',
      width: '10%',
      editable: false,
      sorter: true,
      render: (text: string, record: ITeam, key: number) => {
        return (pagination.page - 1) * pagination.limit + (key + 1);
      },
      inputNode: (record: ITeam) => <BaseInput />,
    },
    {
      title: t('teams.name'),
      dataIndex: 'name',
      width: '40%',
      editable: true,
      sorter: true,
      ...TableSearch('name', handleNameSearch),
      inputNode: (record: ITeam) => <BaseInput defaultValue={record.name} />,
    },
    {
      title: t('teams.active'),
      dataIndex: 'isActive',
      width: '10%',
      editable: true,
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      render: (text: string, record: ITeam) => {
        return record.isActive ? 'YES' : 'NO';
      },
      inputNode: (record: ITeam) => <Switch defaultChecked={record.isActive} />,
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '40%',
      render: (text: string, record: ITeam) => {
        const editable = isEditing(record);
        return (
          <BaseSpace>
            {editable ? (
              <>
                <BaseButton type="primary" onClick={() => save(String(record._id))}>
                  {t('common.save')}
                </BaseButton>
                <BasePopconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                  <BaseButton type="ghost">{t('common.cancel')}</BaseButton>
                </BasePopconfirm>
              </>
            ) : (
              <>
                <BaseButton type="ghost" disabled={editingKey !== ''} onClick={() => edit(record)}>
                  {t('common.edit')}
                </BaseButton>
                <BasePopconfirm title={t('tables.deleteInfo')} onConfirm={() => handleDeleteRow(String(record._id))}>
                  <BaseButton type="default" danger>
                    {t('tables.delete')}
                  </BaseButton>
                </BasePopconfirm>
              </>
            )}
          </BaseSpace>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ITeam) => ({
        record,
        inputNode: col.inputNode(record),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <PageTitle>{t('common.team')}</PageTitle>
      <PageHeader title={t('common.team')}>
        <BaseRow align="middle">
          <BaseCol>
            <BaseTooltip showArrow={true} placement="left" title={t('teams.add-team')}>
              <BaseButton
                type="primary"
                color="yellow"
                style={{ fontSize: '40px' }}
                size="small"
                shape="circle"
                onClick={() => setIsAddTeamModal(true)}
              >
                +
              </BaseButton>
            </BaseTooltip>
          </BaseCol>
        </BaseRow>
      </PageHeader>
      <BaseTable
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        columns={mergedColumns}
        rowClassName="editable-row"
        bordered
        loading={loading}
        dataSource={tableData}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: total,
        }}
        onChange={handleTableChange}
      />
      <BaseModal
        title={t('common.addTeam')}
        open={isAddTeamModal}
        footer={false}
        onCancel={() => setIsAddTeamModal(false)}
      >
        <AddTeam hideAddTeamModal={hideAddTeamModal} />
      </BaseModal>
    </>
  );
};

export default Teams;
