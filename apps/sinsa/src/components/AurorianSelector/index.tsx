import { antdModalV5, create, useModal } from '@ebay/nice-modal-react';
import { Modal } from 'antd';
import type { InnerAurorianSelectorProps } from './InnerAurorianSelector';
import { InnerAurorianSelector } from './InnerAurorianSelector';

interface AurorianSelectorProps extends InnerAurorianSelectorProps {}

export const AurorianSelector = create<AurorianSelectorProps>(({ multi }) => {
  const modal = useModal();
  return (
    <Modal
      {...antdModalV5(modal)}
      title={multi ? '快速编队' : '选择光灵'}
      onOk={e => {
        e.stopPropagation();
        modal.resolve('hello');
        modal.hide();
      }}
      width={'1000px'}
    >
      <InnerAurorianSelector multi={multi} />
    </Modal>
  );
});
