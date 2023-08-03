import { ChangeEvent, FC } from 'react';
import produce from 'immer';
import { GemJSON, SkillSetupJSON } from '../../types';
import Input from '../Input';
import Label from '../Label';
import LinkButton from '../LinkButton';
import gems from '../../data/generated/gems.json';
import styles from './SkillSetupSelector.module.scss';
import Button from '../Button';
import Autocomplete from '../Autocomplete';
import { makeGem, makeSkillSetup } from '../../build';
import { changeLevelRequirement } from '../../utils/setups';

type SkillSetupSelectorProps = {
  value: SkillSetupJSON[];
  onChange: (newSetups: SkillSetupJSON[]) => void;
};

const gemOptions = Object.values(gems).map((gem) => ({
  label: gem.name,
  value: gem.name,
}));

const SkillSetupSelector: FC<SkillSetupSelectorProps> = ({
  value,
  onChange,
}) => {
  const addSetup = () => {
    onChange([...value, makeSkillSetup()]);
  };

  const handleLevelChange = (
    changedSetup: SkillSetupJSON,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const type = event.target.name;
    if (type !== 'from' && type !== 'to') throw new Error('Invalid input name');
    const newValue = changeLevelRequirement(
      value,
      changedSetup,
      type,
      event.target.value
    );
    if (newValue) onChange(newValue);
  };

  const handleGemChange = (
    changedSetup: SkillSetupJSON,
    changedGem: GemJSON,
    newValue: string
  ) => {
    onChange(
      produce(value, (draft) => {
        const matchingSetup = draft.find(
          (setup) => setup.id === changedSetup.id
        );
        const matchingGem = matchingSetup?.links.find(
          (gem) => gem.id === changedGem.id
        );
        if (!matchingGem) {
          console.error('Unexpected situation', draft, changedSetup);
          return;
        }

        matchingGem.name = newValue;
      })
    );
  };

  const setNotes = (
    changedSetup: SkillSetupJSON,
    changedGem: GemJSON,
    newValue: string
  ) => {
    onChange(
      produce(value, (draft) => {
        const matchingSetup = draft.find(
          (setup) => setup.id === changedSetup.id
        );
        const matchingGem = matchingSetup?.links.find(
          (gem) => gem.id === changedGem.id
        );
        if (!matchingGem) {
          console.error('Unexpected situation', draft, changedSetup);
          return;
        }

        matchingGem.notes = newValue;
      })
    );
  };

  const removeGem = (changedSetup: SkillSetupJSON, changedGem: GemJSON) => {
    onChange(
      produce(value, (draft) => {
        const setupIndex = draft.findIndex(
          (setup) => setup.id === changedSetup.id
        );
        const matchingSetup = draft[setupIndex];
        if (!matchingSetup) return;

        const gemIndex = matchingSetup.links.findIndex(
          (gem) => gem.id === changedGem.id
        );

        if (matchingSetup.links.length === 1) {
          draft.splice(setupIndex, 1);
        } else {
          matchingSetup.links.splice(gemIndex, 1);
        }
      })
    );
  };

  const addGem = (changedSetup: SkillSetupJSON) => {
    onChange(
      produce(value, (draft) => {
        const matchingSetup = draft.find(
          (setup) => setup.id === changedSetup.id
        );
        if (!matchingSetup) {
          console.error('Unexpected situation', draft, changedSetup);
          return;
        }

        matchingSetup.links.push(makeGem());
      })
    );
  };

  return (
    <Label
      as="div"
      className={styles.root}
      sticky
      name={
        <div className={styles.setupsLabel}>
          <span>Skills</span>
          <LinkButton className={styles.button} onClick={addSetup}>
            + Add gem setup
          </LinkButton>
        </div>
      }
    >
      <ul className={styles.setups}>
        {value.map((setup) => (
          <li key={setup.id} className={styles.setup}>
            <Label name="Level range (inclusive)">
              <div className={styles.levels}>
                <Input
                  className={styles.levelSelect}
                  type="number"
                  name="from"
                  value={setup.from || ''}
                  placeholder="From"
                  min="0"
                  autoFocus
                  onChange={(event) => handleLevelChange(setup, event)}
                />
                <Input
                  className={styles.levelSelect}
                  type="number"
                  name="to"
                  value={setup.to || ''}
                  placeholder="To"
                  max="100"
                  onChange={(event) => handleLevelChange(setup, event)}
                />
              </div>
            </Label>

            <Label as="div" name="Gems" inputWrapperClassName={styles.gemsList}>
              {setup.links.map((gem) => (
                <div key={gem.id} className={styles.gemRow}>
                  <Autocomplete
                    options={gemOptions}
                    value={gem.name}
                    onChange={(value) => handleGemChange(setup, gem, value)}
                    className={styles.gemSelect}
                    autoFocus
                    placeholder="Type a gem name"
                    dontSuggest={setup.links.map((gem) => gem.name)}
                  />
                  <Input
                    className={styles.notesInput}
                    value={gem.notes || ''}
                    onChange={(event) =>
                      setNotes(setup, gem, event.target.value)
                    }
                    placeholder="Notes (optional)"
                  />
                  <Button
                    className={styles.deleteGemButton}
                    variant="secondary"
                    size="small"
                    onClick={() => removeGem(setup, gem)}
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </Label>

            <Button
              variant="secondary"
              onClick={() => addGem(setup)}
              disabled={setup.links.length >= 6}
            >
              Add gem
            </Button>
          </li>
        ))}
      </ul>
    </Label>
  );
};

export default SkillSetupSelector;
