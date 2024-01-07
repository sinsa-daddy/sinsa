import { model } from '@modern-js/runtime/model';
import { DARK_MODE_KEY } from '@/services/dark-mode';

interface DarkState {
  mode: 'dark' | 'system' | 'light';
}

export const DarkModel = model<DarkState>('dark').define({
  state: {
    mode: localStorage.getItem(DARK_MODE_KEY) ?? 'light',
  },
  actions: {},
});
