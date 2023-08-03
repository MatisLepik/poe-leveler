import { ChangeEvent, FC } from 'react';
import produce from 'immer';
import { ItemSetup } from '../../types';
import Input from '../Input';
import Label from '../Label';
import LinkButton from '../LinkButton';
import styles from './ItemSetupsSelector.module.scss';
import Button from '../Button';
import { makeItemSetup } from '../../build';
import { changeLevelRequirement } from '../../utils/setups';

type ItemSetupsSelectorProps = {
  value: ItemSetup[];
  onChange: (newSetups: ItemSetup[]) => void;
};

const ItemSetupsSelector: FC<ItemSetupsSelectorProps> = ({
  value,
  onChange,
}) => {
  const addSetup = () => {
    onChange([...value, makeItemSetup()]);
  };

  const handleLevelChange = (
    changedSetup: ItemSetup,
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

  const change = (
    changedSetup: ItemSetup,
    field: 'name' | 'notes',
    newValue: string
  ) => {
    onChange(
      produce(value, (draft) => {
        const matchingSetup = draft.find(
          (setup) => setup.id === changedSetup.id
        );

        if (!matchingSetup) {
          console.error('Unexpected situation', draft, changedSetup);
          return;
        }

        matchingSetup[field] = newValue;
      })
    );
  };

  const removeSetup = (changedSetup: ItemSetup) => {
    onChange(
      produce(value, (draft) => {
        const matchingSetupIndex = draft.findIndex(
          (setup) => setup.id === changedSetup.id
        );

        draft.splice(matchingSetupIndex, 1);
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
          <span>Items</span>
          <LinkButton className={styles.button} onClick={addSetup}>
            + Add item
          </LinkButton>
        </div>
      }
    >
      <ul className={styles.setups}>
        {value.length === 0 ? (
          <p>
            No items configured. Here you can plan out what items you should
            prioritze or swap to at certain levels.
          </p>
        ) : null}
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
                <Button
                  className={styles.deleteSetupButton}
                  variant="secondary"
                  size="small"
                  onClick={() => removeSetup(setup)}
                >
                  &times;
                </Button>
              </div>
            </Label>

            <Label name="Name">
              <Input
                value={setup.name || ''}
                onChange={(event) => change(setup, 'name', event.target.value)}
                className={styles.textInput}
                autoFocus
              />
            </Label>
            <Label name="Notes (optional)">
              <Input
                value={setup.notes || ''}
                onChange={(event) => change(setup, 'notes', event.target.value)}
                className={styles.textInput}
              />
            </Label>
          </li>
        ))}
      </ul>
    </Label>
  );
};

export default ItemSetupsSelector;
