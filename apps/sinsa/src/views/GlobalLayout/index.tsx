import { ProLayout } from '@ant-design/pro-components';
import { Link, useLocation, useNavigate } from '@modern-js/runtime/router';
import { cloneElement, useCallback, useEffect, useMemo, useState } from 'react';
import type { MenuDataItem } from '@ant-design/pro-components';
import { Flex, FloatButton, Modal, Typography } from 'antd';
import clsx from 'clsx';
import { Provider as NiceModalProvider } from '@ebay/nice-modal-react';
import { MY_ROUTE, RoutePath } from './constants';
import styles from './styels.module.less';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReactComponent as IconLogo } from '@/assets/wrench.svg';
import { ReducedLazyMotion } from '@/plugins/framer-motion';
import { DarkModeButton } from '@/components/DarkModeButton';
import { IS_FOOL } from '@/globalTheme';
import { getCurrentDomainKey, DOMAIN_ORIGIN } from '@/config/domain';
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
        <Flex
          style={{ marginLeft: '16px', marginRight: '16px' }}
          gap={'0 16px'}
          justify="center"
          wrap="wrap"
        >
          <Link
            className={styles.BeiAn}
            to={`https://beian.miit.gov.cn/`}
            target="_blank"
          >
            粤ICP备2024248618号
          </Link>
          <Link
            to="https://beian.mps.gov.cn/#/query/webSearch?code=44030002003554"
            rel="noreferrer"
            target="_blank"
          >
            <img
              width={16}
              height={16}
              style={{ verticalAlign: '-0.2em' }}
              src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png"
              alt="公安备案"
            />{' '}
            粤公网安备44030002003554
          </Link>
        </Flex>
        <div className={styles.BuildVersion}>
          {__COMMIT_TIME__}_{__COMMIT_HASH__}
        </div>
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

  const [domainKey] = useState(() => getCurrentDomainKey());

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    if (domainKey === 'unknown') {
      modal.confirm({
        title: '域名变更说明',
        content: (
          <div>
            <p>
              本站决定将国内访问地址更换到新域名:{' '}
              <Typography.Text strong copyable>
                sinsa.top
              </Typography.Text>
            </p>
            <p>
              之后红油扳手作业站将会统一有两个域名: <br />
              <Typography.Text strong>
                {DOMAIN_ORIGIN.cn} (国内访问)
              </Typography.Text>{' '}
              和{' '}
              <Typography.Text strong>
                {DOMAIN_ORIGIN.i18n} (国外访问)
              </Typography.Text>
            </p>
            <p>
              如果您已经将本站添加到屏幕, 请在重新添加一次,
              并且可以把旧站点收藏夹或者书签删除
            </p>
            <p>感谢大家的支持</p>
          </div>
        ),
        okText: `访问 ${DOMAIN_ORIGIN.cn}`,
        cancelText: '以后再说',
        onOk() {
          window.browserClient.sendEvent?.({
            name: 'react_to_new_site_modal',
            categories: {
              choice: 'ok',
            },
          });
          window.location.host = DOMAIN_ORIGIN.cn;
        },
        onCancel() {
          window.browserClient.sendEvent?.({
            name: 'react_to_new_site_modal',
            categories: {
              choice: 'cancel',
            },
          });
        },
      });
    }
  }, [domainKey]);

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
          <NiceModalProvider>
            {children}
            {contextHolder}
          </NiceModalProvider>
        </ReducedLazyMotion>
      </ProLayout>
      <FloatButton.BackTop />
    </>
  );
};
