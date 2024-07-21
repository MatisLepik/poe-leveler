import { FC } from 'react';
import { useNavigate } from 'react-router';
import BuildOverview from '../../../components/BuildOverview';
import Button from '../../../components/Button';
import ContentWrapper from '../../../components/ContentWrapper';
import Header from '../../../components/Header';
import PageRoot from '../../../components/PageRoot';
import useBuildSaves, { BuildSave } from '../../../hooks/useBuildSaves';
import jsonpack from 'jsonpack';
import produce from 'immer';

import styles from './BuildList.module.scss';
import CopyButton from '../../../components/CopyButton';
import OpenBuildButton from '../../../components/OpenBuildButton';
import Clear from '../../../components/icons/Clear';

const BuildList: FC = () => {
  const navigate = useNavigate();
  const [buildSaves, setBuildSaves] = useBuildSaves();

  const removeSave = (save: BuildSave) => {
    setBuildSaves((prev) =>
      produce(prev, (draft) => {
        const existing = buildSaves.findIndex(
          (stored) => stored.build.id === save.build.id
        );

        if (existing !== -1) {
          draft.splice(existing, 1);
        }
      })
    );
  };

  const confirmRemoval = (save: BuildSave) => {
    if (confirm('Are you sure you wish to delete this build?'))
      removeSave(save);
  };

  return (
    <PageRoot className={styles.root}>
      <Header title="PoE Leveler - Builds" className={styles.header}>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => navigate('/create')}>
            Create new build
          </Button>
          <Button variant="secondary" onClick={() => navigate('/import')}>
            Import from code
          </Button>
        </div>
      </Header>
      <ContentWrapper>
        {buildSaves.length > 0 ? (
          <ul className={styles.buildList}>
            {buildSaves.map((save) => (
              <li key={save.build.id} className={styles.buildRow}>
                <BuildOverview build={save.build} addedAt={save.addedAt} />
                <div className={styles.actions}>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/builds/${save.build.id}/edit`)}
                  >
                    Edit
                  </Button>

                  <CopyButton getText={() => jsonpack.pack(save.build)} />
                  <Button
                    variant="secondary"
                    onClick={() => confirmRemoval(save)}
                  >
                    <Clear />
                  </Button>
                  <OpenBuildButton buildId={save.build.id} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', marginTop: 148 }}>
            Looks like you don&apos;t have any builds yet. <br />
            Use the buttons in the header to plan out a build, or import a code
            from someone else&apos;s build!
          </p>
        )}
      </ContentWrapper>
    </PageRoot>
  );
};

export default BuildList;
