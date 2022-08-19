import type { Build } from '../../types';
import cn from 'classnames';
import styles from './Leveler.module.scss';
import Button from '../../components/Button';
import SkillSetup from '../../components/SkillSetup';
import ItemSetup from '../../components/ItemSetup';
import useLocalStorageState from 'use-local-storage-state';
import StatRequirements from '../../components/StatRequirements';
import { orderBy } from 'lodash';
import { FC, useEffect, useMemo } from 'react';
import usePrevious from '../../hooks/usePrevious';
import useNotifications from '../../hooks/useNotifications';
import Celebration from '../../components/icons/Celebration';
import Sword from '../../components/icons/Sword';
import Task from '../../components/icons/Task';
import SkillSetupNotification from '../../components/SkillSetupNotification';
import Notifications from '../../components/Notifications';
import useEventListener from '@use-it/event-listener';
import Header from '../../components/Header';
import PageRoot from '../../components/PageRoot';
import BuildOverview from '../../components/BuildOverview';
import ContentWrapper from '../../components/ContentWrapper';
import { useNavigate, useParams } from 'react-router';
import useBuildSaves from '../../hooks/useBuildSaves';
import { getBuild } from '../../build';

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
  const previousLevel = usePrevious(level);
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
    addNotification,
    removeNotification,
    isNotificationDrawerOpen,
    setNotificationDrawerOpen,
  ] = useNotifications();

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

  useEffect(() => {
    if (
      previousLevel == null ||
      level <= previousLevel ||
      previousLevel === level
    ) {
      return;
    }

    const newSkillSetups = currentSkillSetups.filter(
      (setup) => setup.from === level
    );
    const newItemSetups = currentItemSetups.filter(
      (setup) => setup.from === level
    );

    const removedSkillSetups = build.skillSetups.filter(
      (setup) => setup.to === level - 1
    );

    const newTasks = build.tasks.filter((task) => task.from === level);

    if (newSkillSetups.length > 0) {
      addNotification(
        `Skill setup changed`,
        <div className={styles.skillSetupNotificationContent}>
          <SkillSetupNotification
            addedSetups={newSkillSetups}
            removedSetups={removedSkillSetups}
          />
        </div>,
        Celebration
      );
    }

    if (newItemSetups.length > 0) {
      addNotification(
        `New ${newItemSetups.length > 1 ? 'items' : 'item'} unlocked`,
        newItemSetups.map((setup) => setup.name).join('; '),
        Sword
      );
    }

    newTasks.forEach((task) =>
      addNotification(`New task unlocked`, task.message, Task)
    );
  }, [
    level,
    previousLevel,
    addNotification,
    build,
    currentSkillSetups,
    currentItemSetups,
  ]);

  return (
    <PageRoot className={styles.root}>
      <Header title={<BuildOverview build={build} />} className={styles.header}>
        <Button variant="secondary" onClick={() => navigate('/')}>
          View all builds
        </Button>
      </Header>

      <ContentWrapper className={styles.sections}>
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
                />
              ))}
            </div>
          </div>
        </div>
      </ContentWrapper>
      <Notifications
        notifications={notifications}
        removeNotification={removeNotification}
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
