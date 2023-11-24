import { Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useParams } from '@modern-js/runtime/router';
import useSWR from 'swr';
import { fetcher } from '@/utils/swr';
import { TermNotFound } from '@/containers/TermNotFound';

const CopilotPage: React.FC = () => {
  const params = useParams<{ table_id: string }>();

  const { data, error, isLoading } = useSWR(
    `/api/copilots/${params.table_id}.json`,
    fetcher,
  );

  console.log('data2', data);

  if (error) {
    return <TermNotFound />;
  }

  return (
    <PageContainer loading={isLoading}>
      <Button type="primary">我是作业</Button>
      {/* <pre>{JSON.stringify(useLoaderData())}</pre> */}
    </PageContainer>
  );
};

export default CopilotPage;
