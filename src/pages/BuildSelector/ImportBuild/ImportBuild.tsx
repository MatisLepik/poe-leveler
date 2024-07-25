import { FC, useMemo, useState } from 'react';
import jsonpack from 'jsonpack';
import produce from 'immer';

import Button from '../../../components/Button';
import ContentWrapper from '../../../components/ContentWrapper';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import PageRoot from '../../../components/PageRoot';

import styles from './ImportBuild.module.scss';
import { BuildJSON } from '../../../types';
import BuildOverview from '../../../components/BuildOverview';
import { useNavigate } from 'react-router';
import useBuildSaves from '../../../hooks/useBuildSaves';

const ImportBuild: FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>('');
  const [buildSaves, setBuildSaves] = useBuildSaves();

  const build = useMemo<string | BuildJSON | null>(() => {
    if (!code) return null;

    try {
      const build = jsonpack.unpack(code) as BuildJSON;

      if (typeof build !== 'object' || !build?.name) {
        return 'Failed to parse the code.';
      }

      return build;
    } catch (err) {
      return 'Invalid code.';
    }
  }, [code]);

  const isValidBuild = typeof build === 'object' && build !== null;

  const submit = () => {
    if (!isValidBuild) return;
    setBuildSaves((prev) =>
      produce(prev, (draft) => {
        const existing = buildSaves.findIndex(
          (stored) => stored.build.id === build.id
        );
        const stored = { build, addedAt: new Date().toISOString() };

        if (existing !== -1) {
          draft[existing] = stored;
        } else {
          draft.unshift(stored);
        }
      })
    );

    navigate('/');
  };

  return (
    <PageRoot className={styles.root}>
      <Header title="PoE Leveler - Import build" className={styles.header}>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to build list
        </Button>
      </Header>
      <ContentWrapper>
        <p>
          After creating a build, you can copy its code and share it with
          others. They can then import it in this page.
        </p>
        <div className={styles.inputOutput}>
          <Input
            className={styles.input}
            value={code}
            onChange={(evt) => setCode(evt.target.value)}
            type="text"
            placeholder="Enter the code"
          />
          {isValidBuild ? <BuildOverview build={build} /> : null}
          {!isValidBuild && typeof build === 'string' ? (
            <div>{build}</div>
          ) : null}
        </div>

        <Button
          className={styles.submit}
          disabled={!isValidBuild}
          onClick={submit}
        >
          Import
        </Button>
      </ContentWrapper>
    </PageRoot>
  );
};

export default ImportBuild;
