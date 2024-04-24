import { PageContainer } from '@ant-design/pro-components';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from 'antd';
import { AurorianSelector } from '@/components/AurorianSelector';

const TeamBuilder: React.FC = () => {
  const modal = useModal(AurorianSelector);
  return (
    <PageContainer title="编队分享">
      <div>
        <Button
          onClick={() => {
            modal
              .show({
                multi: true,
              })
              .then(data => {
                console.log('resolved', data);
              });
          }}
        >
          快速编队
        </Button>
        <Button
          onClick={() => {
            modal.show({}).then(data => {
              console.log('resolved', data);
            });
          }}
        >
          替换光灵
        </Button>
      </div>
    </PageContainer>
  );
};

export default TeamBuilder;
