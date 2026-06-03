import { useRef } from 'react';
import styles from './TextPopUp.module.css';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';

interface TextPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  value: string;
  onChange: (value: string) => void;
  labelCancel?: string;
  labelConfirm?: string;
}

export const TextPopUp = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText,
  value,
  onChange,
  labelCancel = 'Cancelar', 
  labelConfirm = 'Confirmar' 
}: TextPopUpProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isConfirmEnabled = value === confirmText;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      maxWidth="400px"
      initialFocusRef={inputRef}
    >
      <form action={onConfirm} className={styles.modal}>
        <p className={styles.confirmHint}>
          (Escreva <strong>{confirmText}</strong> para confirmar)
        </p>

        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={`${confirmText}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <div className={styles.buttonGroup}>
          <Button className={styles.cancelButton} text={labelCancel} onClick={onClose} />
          <Button 
            className={styles.confirmButton} 
            text={labelConfirm}
            disabled={!isConfirmEnabled}
            type='submit'
          />
        </div>
      </form>
    </Modal>
  );
};