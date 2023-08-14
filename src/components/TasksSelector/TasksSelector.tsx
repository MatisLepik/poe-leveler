import { ChangeEvent, FC } from 'react';
import produce from 'immer';
import { Task } from '../../types';
import Input from '../Input';
import Label from '../Label';
import LinkButton from '../LinkButton';
import styles from './TasksSelector.module.scss';
import Button from '../Button';
import { makeTask } from '../../build';

type TasksSelectorProps = {
  value: Task[];
  onChange: (newTasks: Task[]) => void;
};

const TasksSelector: FC<TasksSelectorProps> = ({ value, onChange }) => {
  const addtask = () => {
    onChange([...value, makeTask()]);
  };

  const handleLevelChange = (
    changedTask: Task,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value: eventValue } = event.target;

    const number = Number(eventValue);

    if (isNaN(number) || number < 0 || number > 100) return;

    onChange(
      produce(value, (draft) => {
        const matchingSetup = draft.find(
          (setup) => setup.id === changedTask.id
        );

        if (!matchingSetup) {
          console.error('Unexpected situation', draft, changedTask);
          return;
        }

        matchingSetup.from = number;
      })
    );
  };

  const change = (changedTask: Task, field: 'message', newValue: string) => {
    onChange(
      produce(value, (draft) => {
        const matchingSetup = draft.find(
          (setup) => setup.id === changedTask.id
        );

        if (!matchingSetup) {
          console.error('Unexpected situation', draft, changedTask);
          return;
        }

        matchingSetup[field] = newValue;
      })
    );
  };

  const removeTask = (changedTask: Task) => {
    onChange(
      produce(value, (draft) => {
        const matchingSetupIndex = draft.findIndex(
          (setup) => setup.id === changedTask.id
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
          <span>Tasks</span>
          <LinkButton className={styles.button} onClick={addtask}>
            + Add item
          </LinkButton>
        </div>
      }
    >
      <ul className={styles.setups}>
        {value.length === 0 ? (
          <p>
            No tasks configured. Here you can add level based reminders, e.g
            leveling gems in off-hand, doing lab, etc
          </p>
        ) : null}
        {value.map((setup) => (
          <li key={setup.id} className={styles.setup}>
            <div className={styles.levels}>
              <Label name="Level to trigger">
                <Input
                  className={styles.levelSelect}
                  type="number"
                  name="from"
                  value={setup.from || ''}
                  placeholder="0"
                  min="0"
                  onChange={(event) => handleLevelChange(setup, event)}
                />
              </Label>

              <Button
                className={styles.deleteSetupButton}
                variant="secondary"
                size="small"
                onClick={() => removeTask(setup)}
              >
                &times;
              </Button>
            </div>

            <Label name="Name">
              <Input
                value={setup.message || ''}
                onChange={(event) =>
                  change(setup, 'message', event.target.value)
                }
                className={styles.textInput}
              />
            </Label>
          </li>
        ))}
      </ul>
    </Label>
  );
};

export default TasksSelector;
