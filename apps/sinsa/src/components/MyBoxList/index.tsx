import type React from 'react';
import { ProList } from '@ant-design/pro-components';
import type { MyBoxType } from '@sinsa/schema';
import { Typography } from 'antd';

interface MyBoxListProps {
  dataSource: MyBoxType[];
}

export const MyBoxList: React.FC<MyBoxListProps> = ({ dataSource }) => {
  return (
    <ProList<MyBoxType>
      dataSource={dataSource}
      rowKey={item => `${item.create_time.valueOf()}`}
      metas={{
        title: {
          dataIndex: 'title',
        },
        description: {
          render(_, row) {
            return <>创建于 {row.create_time.toString()}</>;
          },
        },
        actions: {
          render: () => [
            <Typography.Link key="detail">详情</Typography.Link>,
            <Typography.Link key="edit">编辑</Typography.Link>,
            <Typography.Link key="delete" type="danger">
              删除
            </Typography.Link>,
          ],
        },
      }}
    />
  );
};
