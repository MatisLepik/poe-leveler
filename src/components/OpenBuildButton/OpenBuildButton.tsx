import { FC } from 'react';
import { useNavigate } from 'react-router';
import useLocalStorageState from 'use-local-storage-state';
import Button from '../Button';

import styles from './OpenBuildButton.module.scss';

type OpenBuildButtonProps = {
  buildId: string;
};

const OpenBuildButton: FC<OpenBuildButtonProps> = ({ buildId }) => {
  const navigate = useNavigate();

  const [level] = useLocalStorageState<number>(`level-${buildId}`, {
    defaultValue: 1,
  });

  return (
    <Button
      className={styles.root}
      onClick={() => navigate(`/builds/${buildId}`)}
    >
      {level > 1 ? 'Continue' : 'Start'}
    </Button>
  );
};

export default OpenBuildButton;
