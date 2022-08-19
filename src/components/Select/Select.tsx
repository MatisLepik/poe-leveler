import { ChangeEventHandler, FC } from 'react';

import styles from './Select.module.scss';

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  options: Option[];
  value: Option['value'] | null;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  name: string;
  placeholder?: string;
  required?: boolean;
};

const Select: FC<SelectProps> = ({
  options,
  value,
  onChange,
  name,
  placeholder,
  required,
}) => {
  return (
    <select
      className={styles.root}
      required={required}
      value={value ?? ''}
      onChange={onChange}
      name={name}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
