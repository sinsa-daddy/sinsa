import { useModel } from '@modern-js/runtime/model';
import { Button, Result } from 'antd';
import { Link } from '@modern-js/runtime/router';
import { TermsModel } from '@/models/terms';
import { RoutePath } from '@/components/MyLayout/constants';

export const TermNotFound: React.FC = () => {
  const [{ firstTerm }] = useModel(TermsModel);

  return (
    <Result
      status="404"
      title="荒典作业不见了"
      subTitle="检查链接是否正确或返回最近荒典作业"
      extra={
        firstTerm ? (
          <Link to={RoutePath.Copilots(firstTerm.term)}>
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
