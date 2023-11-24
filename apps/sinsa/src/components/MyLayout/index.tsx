import { ProLayout } from '@ant-design/pro-layout';
import { useLocation, useNavigate } from '@modern-js/runtime/router';
import { useCallback } from 'react';
import type { MenuDataItem } from '@ant-design/pro-layout/es/typing';
import { MY_ROUTE, RoutePath } from './constants';
import { ReactComponent as IconLogo } from '@/assets/wrench.svg';

interface MyLayoutProps {
  defaultCopilotsTableId?: string;
}

export const MyLayout: React.FC<React.PropsWithChildren<MyLayoutProps>> = ({
  children,
  defaultCopilotsTableId,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const renderMenuItem = useCallback(
    (item: MenuDataItem, dom: React.ReactNode) => {
      if (item.path === RoutePath.Copilots() && !defaultCopilotsTableId) {
        return <div />;
      }
      return (
        <div
          onClick={e => {
            e.stopPropagation();
            if (typeof item.path === 'string') {
              switch (item.path) {
                case RoutePath.Copilots():
                  navigate(RoutePath.Copilots(defaultCopilotsTableId));
                  break;
                default:
                  navigate(item.path);
                  break;
              }
            }
          }}
        >
          {dom}
        </div>
      );
    },
    [defaultCopilotsTableId],
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
