import { ProLayout } from '@ant-design/pro-components';
import { Link, useLocation, useNavigate } from '@modern-js/runtime/router';
import { useCallback, useMemo } from 'react';
import type { MenuDataItem } from '@ant-design/pro-components';
import { Flex, FloatButton } from 'antd';
import { MY_ROUTE, RoutePath } from './constants';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReactComponent as IconLogo } from '@/assets/wrench.svg';
import { ReducedLazyMotion } from '@/plugins/framer-motion';
import { DarkModeButton } from '@/components/DarkModeButton';

const NOOP = <div />;

export const GlobalLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const renderMenuItem = useCallback(
    (item: MenuDataItem, dom: React.ReactNode) => {
      if (!item.path) {
        return NOOP;
      }
      switch (item.path) {
        case RoutePath.Copilots():
          return <Link to={RoutePath.Copilots('latest')}>{dom}</Link>;
        case RoutePath.Solutions():
          return <Link to={RoutePath.Solutions('latest')}>{dom}</Link>;
        default:
          return (
            <Link to={item.path} target={item.link ? '_blank' : undefined}>
              {dom}
            </Link>
          );
      }
    },
    [],
  );

  const handleClickLogo = useCallback(() => {
    navigate('/');
  }, []);

  const token = useMemo(() => {
    return { pageContainer: { paddingInlinePageContainerContent: 16 } };
  }, []);

  return (
    <>
      <ProLayout
        title="红油扳手作业站"
        logo={<IconLogo />}
        location={location}
        fixSiderbar
        route={MY_ROUTE}
        menuItemRender={renderMenuItem}
        onMenuHeaderClick={handleClickLogo}
        siderWidth={200}
        layout="side"
        token={token}
        ErrorBoundary={ErrorBoundary}
        headerContentRender={(_, dom) => (
          <Flex justify="flex-end">
            {dom}
            <DarkModeButton />
          </Flex>
        )}
      >
        <ReducedLazyMotion>{children}</ReducedLazyMotion>
      </ProLayout>
      <FloatButton.BackTop />
    </>
  );
};
