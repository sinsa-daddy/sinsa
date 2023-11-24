import { ProLayout } from '@ant-design/pro-layout';
import {
  useLocation,
  useNavigate,
  useRouteLoaderData,
} from '@modern-js/runtime/router';
import { useCallback } from 'react';
import type { MenuDataItem } from '@ant-design/pro-layout/es/typing';
import { MY_ROUTE } from './routes';
import { ReactComponent as IconLogo } from '@/assets/wrench.svg';

export const MyLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const myData = useRouteLoaderData('layout');

  console.log('myData', myData);

  const renderMenuItem = useCallback(
    (item: MenuDataItem, dom: React.ReactNode) => {
      return (
        <div
          onClick={e => {
            e.stopPropagation();
            if (typeof item.path === 'string') {
              navigate(item.path);
            }
          }}
        >
          {dom}
        </div>
      );
    },
    [],
  );

  const handleClickLogo = useCallback(() => {
    navigate('/');
  }, []);

  return (
    <ProLayout
      title="红油扳手作业站"
      logo={<IconLogo />}
      location={location}
      fixedHeader
      route={MY_ROUTE}
      menuItemRender={renderMenuItem}
      onMenuHeaderClick={handleClickLogo}
      siderWidth={200}
    >
      {children}
    </ProLayout>
  );
};
