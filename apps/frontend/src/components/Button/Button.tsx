import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  buttonStyle?: 'primary' | 'secondary' | 'terciary';
  compact?: boolean;
  className?: string;
}

export const Button = ({
  text,
  onClick,
  type = 'button',
  disabled = false,
  buttonStyle = 'primary',
  compact = false,
  className
}: ButtonProps) => {
  return (
    <button
      className={`${className || ''} ${styles.button} ${styles[buttonStyle]}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      data-compact={compact}
    >
      <span>{text}</span>
    </button>
  );
};
