import { useParams } from '@modern-js/runtime/router';
import useSWR from 'swr';
import { fetcher } from '@/utils/swr';
import { TermNotFound } from '@/containers/TermNotFound';
import { CopilotsView } from '@/components/CopilotsView';

const CopilotPage: React.FC = () => {
  const params = useParams<{ table_id: string }>();

  const { data, error, isLoading } = useSWR(
    `/api/copilots/${params.table_id}.json`,
    fetcher,
  );

  if (error) {
    return <TermNotFound />;
  }

  return <CopilotsView isLoading={isLoading} data={data} />;
};

export default CopilotPage;
