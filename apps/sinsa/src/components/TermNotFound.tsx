import { useModel } from '@modern-js/runtime/model';
import { Button, Result } from 'antd';
import { Link } from '@modern-js/runtime/router';
import { TermsModel } from '@/models/terms';
import { RoutePath } from '@/views/GlobalLayout/constants';

export const TermNotFound: React.FC = () => {
  const [{ latestTerm }] = useModel(TermsModel);

  return (
    <Result
      title="暂时没有这期荒典作业"
      subTitle="检查链接是否正确或返回最近荒典作业"
      icon={
        <img
          alt="未找到作业"
          src={`https://s2.loli.net/2024/04/27/BAlKp9ERMiDo8cN.png`}
        />
      }
      extra={
        latestTerm ? (
          <Link to={RoutePath.Copilots('latest')}>
            <Button type="primary">返回最近作业</Button>
          </Link>
        ) : (
          <Link to={RoutePath.Home}>
            <Button type="primary">返回首页</Button>
          </Link>
        )
      }
    />
  );
};
