import { Outlet } from '@modern-js/runtime/router';
import { ConfigProvider, type ThemeConfig } from 'antd';
import { MyLayout } from './__components/MyLayout';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#5c5c5c',
  },
};

export default function Layout() {
  return (
    <ConfigProvider prefixCls="sinsa" theme={theme}>
      <MyLayout>
        <Outlet />
      </MyLayout>
    </ConfigProvider>
  );
}
