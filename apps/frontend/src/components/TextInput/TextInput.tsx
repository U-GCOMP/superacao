import styles from './TextInput.module.css';
import { HTMLInputTypeAttribute, useId } from 'react';

interface TextInputProps {
  name: string;
  type?: HTMLInputTypeAttribute;
  label: string;
  required?: boolean;
}

export const TextInput = ({
  name,
  type = 'text',
  label,
  required = false,
}: TextInputProps) => {
  const inputId = useId();

  return (
    <label htmlFor={inputId} className={styles.label}>
      <span>{label}</span>
      <input
        className={styles.input}
        id={inputId}
        name={name}
        autoComplete="on"
        type={type}
        required={required}
        // The placeholder with a space is necessary to make the label animation work
        placeholder=" "
      />
    </label>
  );
};
