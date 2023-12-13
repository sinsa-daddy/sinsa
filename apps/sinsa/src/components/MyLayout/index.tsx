import { ProLayout } from '@ant-design/pro-components';
import { useLocation, useNavigate } from '@modern-js/runtime/router';
import { useCallback } from 'react';
import type { MenuDataItem } from '@ant-design/pro-components';
import { MY_ROUTE, RoutePath } from './constants';
import { ReactComponent as IconLogo } from '@/assets/wrench.svg';

interface MyLayoutProps {
  defaultTerm?: number;
}

export const MyLayout: React.FC<React.PropsWithChildren<MyLayoutProps>> = ({
  children,
  defaultTerm,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const renderMenuItem = useCallback(
    (item: MenuDataItem, dom: React.ReactNode) => {
      if (item.path === RoutePath.Copilots() && !defaultTerm) {
        return <div />;
      }
      return (
        <div
          onClick={e => {
            e.stopPropagation();
            if (typeof item.path === 'string') {
              switch (item.path) {
                case RoutePath.Copilots():
                  navigate(RoutePath.Copilots(defaultTerm));
                  break;
                case RoutePath.Solutions():
                  navigate(RoutePath.Solutions(defaultTerm));
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
    [defaultTerm],
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
