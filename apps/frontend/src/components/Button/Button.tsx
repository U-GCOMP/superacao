import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  borderRadius?: string; 
}

export const Button = ({
  text,
  onClick,
  type = 'button',
  disabled = false,
  borderRadius, 
}: ButtonProps) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{ borderRadius }} 
    >
      <span>{text}</span>
    </button>
  );
};
