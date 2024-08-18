import type { FilterConfirmProps } from 'antd/es/table/interface';
import { Button, Input, InputRef, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRef } from 'react';

const TableSearch = (dataIndex: string, handleSearch: (search: string) => void) => {
  const searchInput = useRef<InputRef>(null);
  const getColumnSearchProps = () => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      close,
    }: {
      setSelectedKeys: (selectedKey: string) => void;
      selectedKeys: string;
      close: () => void;
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys}
          onChange={(e) => {
            setSelectedKeys(e.target.value);
            handleSearch(e.target.value);
          }}
          onPressEnter={(e) => handleSearch(selectedKeys)}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              handleSearch(selectedKeys);
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: '100%' }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys('');
              handleSearch('');
            }}
            size="small"
            style={{ width: '100%%' }}
          >
            Reset
          </Button>
          <Button
            size="small"
            style={{ width: '100%' }}
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
  });

  return getColumnSearchProps;
};

export default TableSearch;
