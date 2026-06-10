import { useActionState, useState } from 'react';
import { Modal } from '../../../../../components/Modal/Modal';
import { RatingStars } from '../../../../../components/RatingStars/RatingStars';
import { RatingStarsInput } from '../../../../../components/RatingStarsInput/RatingStarsInput';
import { TextArea } from '../../../../../components/TextArea/TextArea';
import { Button } from '../../../../../components/Button/Button';
import styles from './EventRatingsModal.module.css';
import { Link } from 'react-router-dom';

interface RatingItem {
  id: string;
  userId: string;
  userName: string;
  comment?: string | null;
  score: number;
}

interface EventRatingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  ratings: RatingItem[];
  onAddRating: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
}

export const EventRatingsModal = ({
  isOpen,
  onClose,
  eventName,
  ratings,
  onAddRating,
}: EventRatingsModalProps) => {
  const [organized, setOrganized] = useState(1);
  const [punctuality, setPunctuality] = useState(1);
  const [infrastructure, setInfrastructure] = useState(1);
  const [accessibility, setAccessibility] = useState(1);

  const [formKey, setFormKey] = useState(0);

  const [state, formAction, isPending] = useActionState(
    async (_previousState: unknown, formData: FormData) => {
      formData.append('organized', String(organized));
      formData.append('punctuality', String(punctuality));
      formData.append('infrastructure', String(infrastructure));
      formData.append('accessibility', String(accessibility));

      const result = await onAddRating(formData);

      if (result.success) {
        setOrganized(1);
        setPunctuality(1);
        setInfrastructure(1);
        setAccessibility(1);
        setFormKey((prev) => prev + 1);
      }
      return result;
    },
    { success: false, message: '' }
  );

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Avaliações: ${eventName}`}
      className={styles.modal}
    >
      <div className={styles.container} key={formKey}>
        
        <div className={styles.ratingsList}>
          {ratings.map((item) => (
            <div key={item.id} className={styles.ratingCard}>
              <div className={styles.cardHeader}>
                <Link to={`/perfil/${item.userId}`} className={styles.userNameLink}>
                  {item.userName}
                </Link>
                <RatingStars rating={item.score} />
              </div>
              <p className={styles.comment}>{item.comment}</p>
            </div>
          ))}
        </div>

        <form action={formAction} className={styles.ratingForm}>
          <div className={styles.formContent}>
            
            <div className={styles.formLeft}>
              <TextArea
                name="comment"
                label="Adicione sua avaliação:"
                required
                rows={4}
              />
            </div>

            <div className={styles.formRight}>
              <div className={styles.ratingRow}>
                <span>Organização</span>
                <RatingStarsInput name="organized" value={organized} onChange={setOrganized} />
              </div>
              <div className={styles.ratingRow}>
                <span>Cumprimento de horário</span>
                <RatingStarsInput name="punctuality" value={punctuality} onChange={setPunctuality} />
              </div>
              <div className={styles.ratingRow}>
                <span>Infraestrutura</span>
                <RatingStarsInput name="infrastructure" value={infrastructure} onChange={setInfrastructure} />
              </div>
              <div className={styles.ratingRow}>
                <span>Acessibilidade</span>
                <RatingStarsInput name="accessibility" value={accessibility} onChange={setAccessibility} />
              </div>
            </div>

          </div>

          <p className={styles.statusMessage} aria-live="polite">
            {state.message}
          </p>

          <div className={styles.buttonGroup}>
            <Button
              type="submit"
              disabled={isPending}
              buttonStyle="primary"
              className={styles.submitButton}
              text={isPending ? 'Enviando...' : 'Salvar avaliação'}
            />
          </div>
        </form>

      </div>
    </Modal>
  );
};