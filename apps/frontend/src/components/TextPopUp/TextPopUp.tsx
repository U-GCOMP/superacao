import { useState } from 'react';
import styles from './TextPopUp.module.css';

interface TextPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;           // Título personalizável
  description: string;     // Texto explicativo
  confirmText: string;     // Texto que o usuário deve digitar (ex: "Desativar")
  labelCancel?: string;    // Texto do botão cancelar (opcional, default 'Cancelar')
  labelConfirm?: string;   // Texto do botão confirmar (opcional, default 'Confirmar')
}

export const TextPopUp = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText,
  labelCancel = 'Cancelar', 
  labelConfirm = 'Confirmar' 
}: TextPopUpProps) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const isConfirmEnabled = inputValue === confirmText;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        
        <p className={styles.description}>
          {description} (Escreva <strong>{confirmText}</strong> para confirmar)
        </p>

        <input
          type="text"
          className={styles.input}
          placeholder={`Escreva '${confirmText}'`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div className={styles.buttonGroup}>
          <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>
            {labelCancel}
          </button>
          <button 
            className={`${styles.button} ${styles.confirmButton}`} 
            onClick={onConfirm}
            disabled={!isConfirmEnabled}
          >
            {labelConfirm}
          </button>
        </div>
      </div>
    </div>
  );
};