import cn from 'classnames';
import { FC, useEffect, useMemo, useState } from 'react';
import useEventListener from '@use-it/event-listener';
import Button from '../../components/Button';
import SkillSetup from '../../components/SkillSetup';
import ItemSetup from '../../components/ItemSetup';
import useLocalStorageState from 'use-local-storage-state';
import Notifications from '../../components/Notifications';
import Header from '../../components/Header';
import PageRoot from '../../components/PageRoot';
import BuildOverview from '../../components/BuildOverview';
import ContentWrapper from '../../components/ContentWrapper';
import { useNavigate, useParams } from 'react-router';
import useBuildSaves from '../../hooks/useBuildSaves';
import { getBuild } from '../../build';
import { useBuildNotifications } from './Leveler.utils';
import Modal from '../../components/Modal';
import NextUpgrades from '../../components/NextUpgrades';
import { getItemSetups, getSkillSetups } from '../../utils/setups';
import styles from './Leveler.module.scss';
import LinkColors from '../../components/LinkColors';
import { playLevelUp } from '../../utils/soundEffects';
import Input from '../../components/Input';
import { isElectron } from '../../utils/electron';

const Leveler: FC = () => {
  const { buildId } = useParams<{ buildId: string }>();
  const [buildSaves] = useBuildSaves();
  const navigate = useNavigate();
  const [showUpgradesModal, setUpgradesModal] = useState(false);
  const [showColorsModal, setColorsModal] = useState(false);

  const build = useMemo(() => {
    const buildJSON = buildSaves.find((save) => save.build.id === buildId);
    return getBuild(buildJSON?.build);
  }, [buildSaves, buildId]);

  if (!build) throw new Error('Failed to find build with this id');

  const [charName, setCharName] = useLocalStorageState<string>('', {
    defaultValue: '',
  });
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

  useEffect(() => {
    const levelUpHandler = ((
      event: CustomEvent<{
        level: number;
        charName: string;
      }>
    ) => {
      const levelUp = event.detail;
      if (levelUp.charName === charName) {
        setLevel(levelUp.level);
        playLevelUp();
      }
    }) as EventListener;
    window.addEventListener('level-up', levelUpHandler);

    return () => {
      window.removeEventListener('level-up', levelUpHandler);
    };
  }, [charName, setLevel]);

  const levelUp = () => {
    setLevel((prev) => Math.min(100, prev + 1));
  };

  const levelDown = () => {
    setLevel((prev) => Math.max(1, prev - 1));
  };

  const reset = () => {
    setLevel(1);
  };

  const toggleUpgradesModal = () => {
    setUpgradesModal((prev) => !prev);
  };

  const toggleColorsModal = () => {
    setColorsModal((prev) => !prev);
  };

  useEventListener('keydown', (evt: KeyboardEvent) => {
    if (evt.key === 'ArrowLeft') {
      levelDown();
    } else if (evt.key === 'ArrowRight') {
      levelUp();
    }
  });

  const hasItemSetups = build.itemSetups.length > 0;

  return (
    <PageRoot className={styles.root} noPadding>
      <Header
        title={
          <BuildOverview
            build={build}
            description={
              build.link ? (
                <a target="_blank" rel="noopener noreferrer" href={build.link}>
                  {build.link}
                </a>
              ) : undefined
            }
          />
        }
      >
        {isElectron && (
          <Input
            value={charName}
            placeholder="Character name"
            onChange={(event) => setCharName(event.target.value)}
          />
        )}
        <Button variant="secondary" onClick={() => navigate('/')}>
          View all builds
        </Button>
      </Header>

      <ContentWrapper className={styles.sections}>
        <div className={cn(styles.section, styles.skillsSection)}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Current gems</h2>
          </header>
          <div className={styles.sectionContent}>
            <div className={styles.skillSetups}>
              {currentSkillSetups.map((setup) => (
                <SkillSetup
                  key={setup.id}
                  skillSetup={setup}
                  className={styles.skillSetup}
                  level={level}
                  build={build}
                />
              ))}
            </div>
          </div>
        </div>
        {hasItemSetups && (
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
          <div className={styles.right}>
            <div className={styles.controls}>
              <Button variant="secondary" onClick={toggleColorsModal}>
                Link colors
              </Button>
              <Button variant="secondary" onClick={toggleUpgradesModal}>
                Next upgrades
              </Button>
            </div>
          </div>
        </ContentWrapper>
      </footer>
      {showColorsModal && (
        <Modal title="Link colors" dismiss={() => setColorsModal(false)}>
          <LinkColors build={build} />
        </Modal>
      )}
      {showUpgradesModal && (
        <Modal title="Next upgrades" dismiss={() => setUpgradesModal(false)}>
          <NextUpgrades build={build} level={level} />
        </Modal>
      )}
    </PageRoot>
  );
};

export default Leveler;
