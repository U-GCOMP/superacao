import styles from './TextInput.module.css';
import { HTMLInputTypeAttribute, useId } from 'react';

interface TextInputProps {
  name: string;
  type?: HTMLInputTypeAttribute;
  label: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const TextInput = ({
  name,
  type = 'text',
  label,
  required = false,
  value,
  defaultValue,
  onChange,
  className,
}: TextInputProps) => {
  const inputId = useId();

  return (
    <label htmlFor={inputId} className={`${styles.label} ${className || ''}`}>
      <span>{label}</span>
      <input
        className={styles.input}
        id={inputId}
        name={name}
        autoComplete="on"
        type={type}
        required={required}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        // The placeholder with a space is necessary to make the label animation work
        placeholder=" "
      />
    </label>
  );
};
