import styles from './TimeInput.module.css';
import { useId } from 'react';

interface TimeInputProps {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}

export const TimeInput = ({
  name,
  label,
  required = false,
  defaultValue,
}: TimeInputProps) => {
  const inputId = useId();

  return (
    <div className={styles.container}>
      <label htmlFor={inputId} className={styles.label}>
        <span>{label}</span>
        <input
          className={styles.input}
          id={inputId}
          name={name}
          type="time"
          required={required}
          defaultValue={defaultValue}
          placeholder=" " 
        />
      </label>
    </div>
  );
};