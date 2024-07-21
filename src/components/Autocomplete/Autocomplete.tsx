import { FC, useCallback, useEffect, useState } from 'react';
import Autosuggest, { OnSuggestionSelected } from 'react-autosuggest';
import cn from 'classnames';

import styles from './Autocomplete.module.scss';

type Option = {
  label: string;
  value: string;
};

type AutocompleteProps = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  dontSuggest?: string[];
  autoFocus?: boolean;
};

const renderSuggestion = (suggestion: Option) => <div>{suggestion.label}</div>;
const getSuggestionValue = (suggestion: Option) => suggestion.value;

const Autocomplete: FC<AutocompleteProps> = ({
  value,
  options,
  onChange,
  className,
  placeholder,
  dontSuggest,
  autoFocus = false,
}) => {
  const [localValue, setLocalValue] = useState('');
  const [suggestions, setSuggestions] = useState<Option[]>([]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getSuggestions = useCallback(
    (value: string) => {
      const inputValue = value.trim().toLowerCase();

      return options
        .filter((suggestion) => {
          const notIgnored =
            !dontSuggest || !dontSuggest.includes(suggestion.value);
          return (
            suggestion.label.trim().toLowerCase().includes(inputValue) &&
            notIgnored
          );
        })
        .slice(0, 10);
    },
    [options, dontSuggest]
  );

  const onSuggestionsFetchRequested = useCallback(
    ({ value: newValue }: Autosuggest.SuggestionsFetchRequestedParams) => {
      setSuggestions(getSuggestions(newValue));
    },
    [getSuggestions]
  );

  const onSuggestionsClearRequested = useCallback(() => setSuggestions([]), []);

  const handleChange = useCallback<Autosuggest.InputProps<Option>['onChange']>(
    (evt, { newValue }) => {
      setLocalValue(newValue);
    },
    [setLocalValue]
  );

  const select = (valueToSelect: string) => {
    if (options.some((option) => option.value === valueToSelect)) {
      if (valueToSelect !== value) {
        onChange(valueToSelect);
      }
    } else {
      setLocalValue('');
    }
  };

  const handleBlur = () => {
    select(localValue);
  };

  const handleSuggestionSelected: OnSuggestionSelected<Option> = (
    _,
    { suggestion }
  ) => {
    select(suggestion.value);
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      containerProps={{ className: cn(className, styles.root) }}
      onSuggestionSelected={handleSuggestionSelected}
      inputProps={{
        placeholder,
        value: localValue,
        onChange: handleChange,
        onBlur: handleBlur,
        className: styles.input,
        autoFocus,
      }}
    />
  );
};

export default Autocomplete;
