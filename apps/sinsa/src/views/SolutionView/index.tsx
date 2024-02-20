import { Alert, Card, Flex, Typography } from 'antd';
import type { CopilotNextType, TermNextType } from '@sinsa/schema';
import { Provider as NiceModalProvider } from '@ebay/nice-modal-react';
import { SolutionResultProvider } from './context';
import { QueryForm } from './QueryForm';
import { SolutionListView } from './SolutionListView';

interface SolutionViewProps {
  copilots: CopilotNextType[];
  currentTerm: TermNextType;
}

export const SolutionView: React.FC<SolutionViewProps> = ({
  copilots,
  currentTerm,
}) => {
  return (
    <SolutionResultProvider>
      <Flex vertical gap="middle">
        {currentTerm.order === 26 ? (
          <Alert
            type="error"
            showIcon={false}
            banner
            message="光灵黑潮目前装备技能存在 Bug 使得荒典分数可能存在虚高问题。官方将于 1 月 10 日更新后修复。本期黑潮队伍分数仅供参考。"
            action={
              <Typography.Link
                href={`https://www.bilibili.com/read/cv29262782/`}
                target="_blank"
              >
                查看官方公告
              </Typography.Link>
            }
          />
        ) : null}
        <Card>
          <NiceModalProvider>
            <QueryForm copilots={copilots} termId={currentTerm.term_id} />
          </NiceModalProvider>
        </Card>
        <SolutionListView currentTerm={currentTerm} />
      </Flex>
    </SolutionResultProvider>
  );
};
