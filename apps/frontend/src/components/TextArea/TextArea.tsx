import styles from './TextArea.module.css'; // Pode copiar o CSS do TextInput e ajustar
import { useId } from 'react';

interface TextAreaProps {
  name: string;
  label: string;
  required?: boolean;
  rows?: number; 
  defaultValue?: string;
}

export const TextArea = ({
  name,
  label,
  required = false,
  rows = 4,
  defaultValue,
}: TextAreaProps) => {
  const inputId = useId();

  return (
    <label htmlFor={inputId} className={styles.label}>
      <span>{label}</span>
      <textarea
        className={styles.textarea} 
        id={inputId}
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue}
        placeholder=" "
      />
    </label>
  );
};