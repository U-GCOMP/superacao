import styles from './DateInput.module.css';
import { useId } from 'react';

interface DateInputProps {
  name: string;
  label: string;
  required?: boolean;
}

export const DateInput = ({
  name,
  label,
  required = false,
}: DateInputProps) => {
  const inputId = useId();

  return (
      <label htmlFor={inputId} className={styles.label}>
        <span>{label}</span>
        <input
          className={styles.input}
          id={inputId}
          name={name}
          type="date"
          required={required}
          placeholder=" "
        />
      </label>
  );
};