import cn from 'classnames';
import { orderBy } from 'lodash';
import { FC, useMemo } from 'react';
import useEventListener from '@use-it/event-listener';

import type { Build } from '../../types';
import Button from '../../components/Button';
import SkillSetup from '../../components/SkillSetup';
import ItemSetup from '../../components/ItemSetup';
import useLocalStorageState from 'use-local-storage-state';
import StatRequirements from '../../components/StatRequirements';
import Notifications from '../../components/Notifications';
import Header from '../../components/Header';
import PageRoot from '../../components/PageRoot';
import BuildOverview from '../../components/BuildOverview';
import ContentWrapper from '../../components/ContentWrapper';
import { useNavigate, useParams } from 'react-router';
import useBuildSaves from '../../hooks/useBuildSaves';
import { getBuild } from '../../build';
import { useBuildNotifications } from './Leveler.utils';

import styles from './Leveler.module.scss';

const getSkillSetups = (build: Build, level: number) => {
  return orderBy(
    build.skillSetups.filter(
      (setup) => level >= setup.from && level <= setup.to
    ),
    [(setup) => setup.from],
    ['asc']
  );
};

const getItemSetups = (build: Build, level: number) => {
  return orderBy(
    build.itemSetups.filter(
      (setup) => level >= setup.from && level <= setup.to
    ),
    [(setup) => setup.from, 'desc']
  );
};

const Leveler: FC = () => {
  const { buildId } = useParams<{ buildId: string }>();
  const [buildSaves] = useBuildSaves();
  const navigate = useNavigate();

  const build = useMemo(() => {
    const buildJSON = buildSaves.find((save) => save.build.id === buildId);
    return getBuild(buildJSON?.build);
  }, [buildSaves, buildId]);

  if (!build) throw new Error('Failed to find build with this id');

  const [level, setLevel] = useLocalStorageState<number>(`level-${build.id}`, {
    defaultValue: 1,
  });
  const currentSkillSetups = useMemo(
    () => getSkillSetups(build, level),
    [build, level]
  );
  const currentItemSetups = useMemo(
    () => getItemSetups(build, level),
    [build, level]
  );

  const [
    notifications,
    ,
    removeNotification,
    clearNotifications,
    isNotificationDrawerOpen,
    setNotificationDrawerOpen,
  ] = useBuildNotifications(
    level,
    build,
    currentSkillSetups,
    currentItemSetups
  );

  const levelUp = () => {
    setLevel((prev) => Math.min(100, prev + 1));
  };

  const levelDown = () => {
    setLevel((prev) => Math.max(1, prev - 1));
  };

  const reset = () => {
    setLevel(1);
  };

  useEventListener('keydown', (evt: KeyboardEvent) => {
    if (evt.key === 'ArrowLeft') {
      levelDown();
    } else if (evt.key === 'ArrowRight') {
      levelUp();
    }
  });

  const hasItems = true;

  return (
    <PageRoot className={styles.root} noPadding>
      <Header title={<BuildOverview build={build} />} className={styles.header}>
        <Button variant="secondary" onClick={() => navigate('/')}>
          View all builds
        </Button>
      </Header>

      <ContentWrapper className={styles.sections}>
        <div className={cn(styles.section, styles.skillsSection)}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Current gems</h2>
            <StatRequirements skillSetups={currentSkillSetups} />
          </header>
          <div className={styles.sectionContent}>
            <div className={styles.skillSetups}>
              {currentSkillSetups.map((setup) => (
                <SkillSetup
                  key={setup.id}
                  skillSetup={setup}
                  className={styles.skillSetup}
                  level={level}
                />
              ))}
            </div>
          </div>
        </div>
        {hasItems && (
          <div className={styles.section}>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Current items</h2>
            </header>
            <div className={styles.sectionContent}>
              <div className={styles.itemSetups}>
                {currentItemSetups.map((setup) => (
                  <ItemSetup
                    key={setup.id}
                    itemSetup={setup}
                    className={styles.itemSetup}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </ContentWrapper>
      <Notifications
        notifications={notifications}
        removeNotification={removeNotification}
        clearNotifications={clearNotifications}
        isOpen={isNotificationDrawerOpen}
        toggle={() => setNotificationDrawerOpen((prev) => !prev)}
      />
      <footer className={styles.footer}>
        <ContentWrapper className={styles.content}>
          <div className={styles.left}>
            <Button variant="secondary" onClick={reset}>
              Reset
            </Button>
            <Button variant="secondary" onClick={levelDown}>
              -1 level
            </Button>
          </div>
          <div className={styles.center}>
            <Button
              size="massive"
              className={styles.levelUpButton}
              onClick={levelUp}
            >
              <span>
                Level:&nbsp;<strong>{level}</strong>
              </span>
              &nbsp;
              <small>(click to level)</small>
            </Button>
          </div>
          <div className={styles.right} />
        </ContentWrapper>
      </footer>
    </PageRoot>
  );
};

export default Leveler;
