import { ProLayout } from '@ant-design/pro-components';
import { Link, useLocation, useNavigate } from '@modern-js/runtime/router';
import { cloneElement, useCallback, useMemo } from 'react';
import type { MenuDataItem } from '@ant-design/pro-components';
import { Flex, FloatButton } from 'antd';
import clsx from 'clsx';
import { Provider as NiceModalProvider } from '@ebay/nice-modal-react';
import { MY_ROUTE, RoutePath } from './constants';
import styles from './styels.module.less';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReactComponent as IconLogo } from '@/assets/wrench.svg';
import { ReducedLazyMotion } from '@/plugins/framer-motion';
import { DarkModeButton } from '@/components/DarkModeButton';
import { IS_FOOL } from '@/globalTheme';
// import ThemeProvider from '@/theme/geek/ThemeProvider';

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

  const isHome = location.pathname === RoutePath.Home;

  const token = useMemo(() => {
    return { pageContainer: { paddingInlinePageContainerContent: 12 } };
  }, []);

  const renderFooter = useCallback(() => {
    return (
      <footer className={styles.Footer}>
        <Flex vertical gap={4}>
          <Link to={`https://beian.miit.gov.cn/`} target="_blank">
            粤ICP备2024248618号
          </Link>
          <div className={styles.BuildVersion}>
            {__COMMIT_HASH__}
            {__COMMIT_TIME__}
          </div>
        </Flex>
      </footer>
    );
  }, []);

  const headerRender = useCallback(
    (_: any, dom: React.ReactElement) => {
      if (isHome) {
        return cloneElement(dom, {
          className: clsx(dom.props.class, styles.HomeHeaderCenterContainer),
        });
      }
      return dom;
    },
    [isHome],
  );

  return (
    <>
      <ProLayout
        title={IS_FOOL ? '白蛙王子作业站' : '红油扳手作业站'}
        logo={
          IS_FOOL ? (
            <img
              src={`https://s2.loli.net/2024/04/27/syG7QYUrkiPlXbm.png`}
              alt="baiwa_logo"
            />
          ) : (
            <IconLogo />
          )
        }
        location={location}
        fixSiderbar
        route={MY_ROUTE}
        menuItemRender={renderMenuItem}
        onMenuHeaderClick={handleClickLogo}
        siderWidth={200}
        layout={isHome ? 'top' : 'side'}
        token={token}
        ErrorBoundary={ErrorBoundary}
        headerContentRender={(_, dom) => (
          <Flex justify="flex-end" align="center">
            {dom}
            <DarkModeButton />
          </Flex>
        )}
        headerRender={headerRender as any}
        footerRender={renderFooter}
      >
        <ReducedLazyMotion>
          <NiceModalProvider>{children}</NiceModalProvider>
        </ReducedLazyMotion>
      </ProLayout>
      <FloatButton.BackTop />
    </>
  );
};
