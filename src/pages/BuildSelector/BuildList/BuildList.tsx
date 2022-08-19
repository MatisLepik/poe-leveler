import { FC } from 'react';
import { useNavigate } from 'react-router';
import BuildOverview from '../../../components/BuildOverview';
import Button from '../../../components/Button';
import ContentWrapper from '../../../components/ContentWrapper';
import Header from '../../../components/Header';
import PageRoot from '../../../components/PageRoot';
import useBuildSaves from '../../../hooks/useBuildSaves';
import jsonpack from 'jsonpack';

import styles from './BuildList.module.scss';
import CopyButton from '../../../components/CopyButton';

const BuildList: FC = () => {
  const navigate = useNavigate();
  const [buildSaves] = useBuildSaves();

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
                  <Button onClick={() => navigate(`/builds/${save.build.id}`)}>
                    Start!
                  </Button>
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
