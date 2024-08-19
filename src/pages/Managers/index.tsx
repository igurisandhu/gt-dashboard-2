import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { getManagers, deleteManager, addManager } from '@app/api/manager.api';
import { notificationController } from '@app/controllers/notificationController';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { PageHeader } from '@app/components/dashboard/common/PageHeader/PageHeader';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseTooltip } from '@app/components/common/BaseTooltip/BaseTooltip';
import { IManager, IManagerEditable } from '@app/interfaces/managers';
import { Modal, Tooltip } from 'antd';
import { AddManager } from '@app/components/manager/addManager/AddManager';
import { ManageTeams } from '@app/components/manager/manageTeams/ManageTeams';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import TableSearch from '@app/components/common/TableSearch';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import { ManagerPermissions } from '@app/components/manager/permissions/ManagerPermissions';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';

const Managers: React.FC = () => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState<IManagerEditable[]>([]);
  const [isAddManagerModal, setIsAddManagerModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 5 });
  const [loading, setLoading] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [nameSort, setNameSort] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [total, setTotal] = useState(0);
  const [selectedManager, setSelectedManager] = useState<string | undefined>(undefined);
  const [isManageTeamModal, setIsManageTeamModal] = useState(false);
  const [isPermissionModal, setIsPermissionModal] = useState(false);

  const GetManagers = (payload: { page?: number; limit?: number; aganet_id?: string }) => {
    setLoading(true);
    getManagers({
      ...pagination,
      ...payload,
      ...(activeFilter !== null ? { isActive: activeFilter } : {}),
      ...(emailSearch && emailSearch != '' ? { email: emailSearch } : {}),
      ...(nameSearch && nameSearch != '' ? { name: nameSearch } : {}),
      sort: nameSort == 'descend' ? -1 : 1,
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
              isActive: record.isActive,
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
      await deleteManager({ _id: rowId });
      setTableData([...tableData.filter((item) => item._id !== rowId)]);
    } catch (errorDeleteManager) {
      notificationController.error({ message: String(errorDeleteManager) });
      console.log('errorDeleteManager:', errorDeleteManager);
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
      await addManager({ ...newData[key], isActive });
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
      render: (text: string, record: IManagerEditable, key: number) => {
        return (pagination.page - 1) * pagination.limit + (key + 1);
      },
    },
    {
      title: t('managers.name'),
      dataIndex: 'name',
      width: '10%',
      sorter: true,
      ...TableSearch('name', setNameSearch),
    },
    {
      title: t('managers.email'),
      dataIndex: 'email',
      width: '10%',
      ...TableSearch('email', setEmailSearch),
    },
    {
      title: t('managers.phone'),
      dataIndex: 'phone',
      width: '10%',
    },
    {
      title: t('managers.country'),
      dataIndex: 'country',
      width: '20%',
    },
    {
      title: t('managers.active'),
      dataIndex: 'isActive',
      width: '5%',
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      render: (text: string, record: IManagerEditable, key: number) => {
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
      render: (text: string, record: IManagerEditable) => {
        return (
          <BaseSpace>
            <BaseButton
              type="ghost"
              onClick={() => {
                setSelectedManager(record._id);
                setIsAddManagerModal(true);
              }}
            >
              {t('common.edit')}
            </BaseButton>
            <BasePopconfirm title={t('tables.deleteInfo')} onConfirm={() => handleDeleteRow(String(record._id))}>
              <BaseButton type="default" danger>
                {t('tables.delete')}
              </BaseButton>
            </BasePopconfirm>
            <Tooltip title={t('managers.manage-team')}>
              <BaseButton
                type="ghost"
                onClick={() => {
                  setSelectedManager(String(record._id));
                  setIsManageTeamModal(true);
                }}
              >
                {t('Teams')}
              </BaseButton>
            </Tooltip>
            <Tooltip title={'Manage Permissions'}>
              <BaseButton
                type="ghost"
                onClick={() => {
                  setSelectedManager(String(record._id));
                  setIsPermissionModal(true);
                }}
              >
                {'Permissions'}
              </BaseButton>
            </Tooltip>
          </BaseSpace>
        );
      },
    },
  ];

  const hideAddManagerModal = () => {
    setSelectedManager(undefined);
    setIsAddManagerModal(false);
    GetManagers(pagination);
  };

  const hideManageTeamsModal = () => {
    setIsManageTeamModal(false);
  };

  const hidePermissionModal = () => {
    setIsPermissionModal(false);
  };

  useEffect(() => {
    GetManagers(pagination);
  }, [pagination, nameSearch, emailSearch, nameSort, activeFilter]);

  return (
    <>
      <BaseModal closable={true} footer={false} onCancel={() => hideAddManagerModal()} open={isAddManagerModal}>
        <AddManager key={selectedManager} manager_id={selectedManager} hideAddManagerModal={hideAddManagerModal} />
      </BaseModal>
      <BaseModal closable={true} footer={false} onCancel={() => hideManageTeamsModal()} open={isManageTeamModal}>
        <ManageTeams manager_id={selectedManager || ''} />
      </BaseModal>
      <BaseModal closable={true} footer={false} onCancel={() => hidePermissionModal()} open={isPermissionModal}>
        <ManagerPermissions manager_id={selectedManager || ''} />
      </BaseModal>
      <PageTitle>{t('managers.managers')}</PageTitle>
      <PageHeader title={t('managers.managers')}>
        <BaseRow align="middle">
          <BaseCol>
            <BaseTooltip showArrow={true} placement="left" title={t('managers.add-manager')}>
              <BaseButton
                type="primary"
                color="yellow"
                style={{ fontSize: '40px', marginLeft: '10px' }}
                size="small"
                shape="circle"
                onClick={() => {
                  setIsAddManagerModal(true);
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

export default Managers;
