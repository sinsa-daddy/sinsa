import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useModel } from '@modern-js/runtime/model';
import { Button } from 'antd';
import styles from './styles.module.less';
import { DarkModel } from '@/models/dark';

export const DarkModeButton: React.FC = () => {
  const [{ mode }, { setMode }] = useModel(DarkModel);

  const toggleDarkMode = (isDark: boolean) => {
    setMode(isDark ? 'dark' : 'system');
  };

  return (
    <Button
      className={styles.Switch}
      onClick={e => {
        e.stopPropagation();
        toggleDarkMode(mode !== 'dark');
      }}
      icon={
        <DarkModeSwitch
          size={14}
          checked={mode === 'dark'}
          onChange={() => {
            // ignore
          }}
        />
      }
    />
  );
};
