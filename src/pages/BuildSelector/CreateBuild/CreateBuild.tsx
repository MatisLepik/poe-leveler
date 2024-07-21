import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react';
import produce from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router';
import ascendancies from '../../../data/ascendancies.json';
import Button from '../../../components/Button';
import ContentWrapper from '../../../components/ContentWrapper';
import Header from '../../../components/Header';
import PageRoot from '../../../components/PageRoot';
import Label from '../../../components/Label';
import Input from '../../../components/Input';
import styles from './CreateBuild.module.scss';
import Select from '../../../components/Select';
import { BuildJSON, ItemSetup, SkillSetupJSON, Task } from '../../../types';
import SkillSetupSelector from '../../../components/SkillSetupSelector';
import { makeSkillSetup } from '../../../build';
import ItemSetupsSelector from '../../../components/ItemSetupsSelector';
import TasksSelector from '../../../components/TasksSelector';
import useBuildSaves from '../../../hooks/useBuildSaves';

type FormType = {
  id?: string;
  name: string;
  ascendancy: string | null;
  skillSetups: SkillSetupJSON[];
  itemSetups: ItemSetup[];
  tasks: Task[];
};

type CreateBuildProps = {
  initialValues?: BuildJSON;
};

const ascendancyOptions = ascendancies.map((ascendancy) => ({
  value: ascendancy.name,
  label: `${ascendancy.name} (${ascendancy.className})`,
}));

const getError = ({ name, ascendancy, skillSetups, itemSetups }: FormType) => {
  if (!name || !ascendancy) {
    return 'Please fill all the fields.';
  }

  if (
    [...itemSetups, ...skillSetups].some(
      (setup) =>
        setup.from !== null && setup.to !== null && setup.from > setup.to
    )
  ) {
    return "Gem's starting level cannot be higher than ending level.";
  }

  return null;
};

const CreateBuild: FC<CreateBuildProps> = ({ initialValues }) => {
  const navigate = useNavigate();
  const [showErrors, setShowErrors] = useState(false);
  const [buildSaves, setBuildSaves] = useBuildSaves();
  const [isEdited, setEdited] = useState(false);
  const [values, setValues] = useState<FormType>(
    () =>
      initialValues ?? {
        name: '',
        ascendancy: null,
        skillSetups: [makeSkillSetup()],
        itemSetups: [],
        tasks: [],
      }
  );
  const changeRef = useRef(false);
  const error = getError(values);
  const isValid = error === null;

  const editValues: React.Dispatch<React.SetStateAction<FormType>> = (
    ...args
  ) => {
    setEdited(true);
    return setValues(...args);
  };

  useEffect(() => {
    setShowErrors(false);
  }, [values]);

  const save = () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    setEdited(false);

    setBuildSaves((prev) =>
      produce(prev, (draft) => {
        const build = { ...values, id: values.id ?? uuidv4() } as BuildJSON;
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
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save();
    navigate('/');
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    changeRef.current = true;

    editValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setSkillSetups = (skillSetups: SkillSetupJSON[]) => {
    editValues((prev) => ({ ...prev, skillSetups }));
  };

  const setItemSetups = (itemSetups: ItemSetup[]) => {
    editValues((prev) => ({ ...prev, itemSetups }));
  };

  const setTasks = (tasks: Task[]) => {
    editValues((prev) => ({ ...prev, tasks }));
  };

  const handleBack = () => {
    if (
      changeRef.current &&
      !confirm('Are you sure you want to leave? Changes will not be saved.')
    ) {
      return;
    }
    navigate('/');
  };

  return (
    <PageRoot className={styles.root}>
      <Header title="PoE Leveler - Create build" className={styles.header}>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleBack}>
            Back to build list
          </Button>
        </div>
      </Header>
      <ContentWrapper>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fields}>
            <div className={styles.horizontalFields}>
              <Label name="Build name">
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  required
                />
              </Label>

              <Label name="Ascendancy">
                <Select
                  options={ascendancyOptions}
                  value={values.ascendancy}
                  onChange={handleChange}
                  required
                  name="ascendancy"
                  placeholder="Choose a value"
                />
              </Label>
            </div>

            <SkillSetupSelector
              value={values.skillSetups}
              onChange={setSkillSetups}
            />

            <ItemSetupsSelector
              value={values.itemSetups}
              onChange={setItemSetups}
            />

            <TasksSelector value={values.tasks} onChange={setTasks} />

            <div className={styles.actions}>
              <Button type="submit">Submit</Button>
              <Button
                type="button"
                variant="secondary"
                disabled={!isEdited}
                onClick={save}
              >
                Save
              </Button>
              {showErrors && error ? <div>{error}</div> : null}
            </div>
          </div>
        </form>
      </ContentWrapper>
    </PageRoot>
  );
};

export default CreateBuild;
