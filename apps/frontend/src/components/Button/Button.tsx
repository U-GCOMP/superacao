import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  buttonStyle?: 'primary' | 'secondary' | 'terciary' | 'tertiary-icon';
  compact?: boolean;
  ariaLabel?: string;
  className?: string;
}

export const Button = ({
  text,
  children,
  onClick,
  type = 'button',
  disabled = false,
  buttonStyle = 'primary',
  compact = false,
  ariaLabel,
  className
}: ButtonProps) => {
  return (
    <button
      className={`${className || ''} ${styles.button} ${styles[buttonStyle]}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      data-compact={compact}
      aria-label={ariaLabel}
    >
      {children || <span>{text}</span>}
    </button>
  );
};
