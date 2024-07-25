import { FormEvent, useEffect, useState } from 'react';
import Input from '../../components/Input';
import styles from './CharacterNameEdit.module.scss';
import Save from '../../components/icons/Save';
import Edit from '../../components/icons/Edit';
import Button from '../../components/Button';
import { LevelTrackStatus } from '../../hooks/useLevelUpTracker';

type CharacterNameEditProps = {
  levelTrackStatus: LevelTrackStatus;
  charName: string;
  setCharName: (newName: string) => void;
};

const colorMap: Record<LevelTrackStatus['status'], string> = {
  error: 'var(--color-negative)',
  success: 'var(--color-positive)',
  warning: 'var(--color-warning)',
};

export default function CharacterNameEdit({
  levelTrackStatus,
  charName,
  setCharName,
}: CharacterNameEditProps) {
  const [localName, setLocalName] = useState(charName);
  const [isEditing, setEditingState] = useState(false);

  const setEditing: React.Dispatch<React.SetStateAction<boolean>> = (
    ...args
  ) => {
    setEditingState(...args);
    setCharName(localName);
  };

  // Keep local copy in sync
  useEffect(() => {
    setLocalName(charName);
  }, [charName]);

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setEditing(false);
  };

  console.log('levelTrackStatus', levelTrackStatus);

  return (
    <form className={styles.levelUpTracker} onSubmit={handleSubmit}>
      <div
        className={styles.statusIndicator}
        title={levelTrackStatus.message}
        style={{
          backgroundColor: colorMap[levelTrackStatus.status],
        }}
      />
      <label className={styles.characterNameEdit}>
        <Input
          value={!isEditing && !localName ? 'Not live updating' : localName}
          disabled={!isEditing}
          placeholder="Character name"
          className={styles.input}
          onChange={(event) => setLocalName(event.target.value)}
        />
        <Button
          aria-label="Edit character name"
          variant="ghost"
          size="small"
          type="button"
          className={styles.editButton}
          onClick={toggleEditing}
        >
          {isEditing ? <Save /> : <Edit />}
        </Button>
      </label>
    </form>
  );
}
