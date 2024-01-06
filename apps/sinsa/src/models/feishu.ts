import { model } from '@modern-js/runtime/model';
import type { FeishuProfileType } from '@/schemas/feishu-profile';

export interface FeishuState {
  profile?: FeishuProfileType;
}

export const FeishuModel = model<FeishuState>('feishu').define({
  state: {
    profile: undefined,
  },
  computed: {
    isLogin: state => typeof state.profile?.name === 'string',
  },
  actions: {},
});
