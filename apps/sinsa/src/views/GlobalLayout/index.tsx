import { ProLayout } from '@ant-design/pro-components';
import { Link, useLocation, useNavigate } from '@modern-js/runtime/router';
import { useCallback, useMemo } from 'react';
import type { MenuDataItem } from '@ant-design/pro-components';
import { useModel } from '@modern-js/runtime/model';
import { MY_ROUTE, RoutePath } from './constants';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReactComponent as IconLogo } from '@/assets/wrench.svg';
import { TermsModel } from '@/models/terms';

const NOOP = <div />;

export const GlobalLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [{ latestTerm }] = useModel(TermsModel);

  const location = useLocation();
  const navigate = useNavigate();

  const renderMenuItem = useCallback(
    (item: MenuDataItem, dom: React.ReactNode) => {
      if (!item.path || (item.requireLatestTerm && !latestTerm?.term)) {
        return NOOP;
      }
      switch (item.path) {
        case RoutePath.Copilots():
          return latestTerm?.term ? (
            <Link to={RoutePath.Copilots(latestTerm.term)}>{dom}</Link>
          ) : (
            NOOP
          );
        case RoutePath.Solutions():
          return latestTerm?.term ? (
            <Link to={RoutePath.Solutions(latestTerm.term)}>{dom}</Link>
          ) : (
            NOOP
          );
        default:
          return <Link to={item.path}>{dom}</Link>;
      }
    },
    [latestTerm?.term],
  );

  const handleClickLogo = useCallback(() => {
    navigate('/');
  }, []);

  const token = useMemo(() => {
    return { pageContainer: { paddingInlinePageContainerContent: 8 } };
  }, []);

  return (
    <ProLayout
      title="红油扳手作业站"
      logo={<IconLogo />}
      location={location}
      fixedHeader
      fixSiderbar
      route={MY_ROUTE}
      menuItemRender={renderMenuItem}
      onMenuHeaderClick={handleClickLogo}
      siderWidth={200}
      layout="mix"
      token={token}
      ErrorBoundary={ErrorBoundary}
    >
      {children}
    </ProLayout>
  );
};
