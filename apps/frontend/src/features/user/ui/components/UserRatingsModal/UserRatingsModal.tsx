import { useActionState, useState } from 'react';
import { Modal } from '../../../../../components/Modal/Modal';
import { RatingStars } from '../../../../../components/RatingStars/RatingStars';
import { RatingStarsInput } from '../../../../../components/RatingStarsInput/RatingStarsInput';
import { TextArea } from '../../../../../components/TextArea/TextArea';
import { Button } from '../../../../../components/Button/Button';
import styles from './UserRatingsModal.module.css'; 
import { Link } from 'react-router-dom';

interface RatingItem {
  id: string;
  userId: string;
  userName: string;
  comment?: string | null;
  score: number;
}

interface UserRatingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserName: string;
  ratings: RatingItem[];
  onAddRating?: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
  canEvaluate?: boolean; 
}

export const UserRatingsModal = ({
  isOpen,
  onClose,
  targetUserName,
  ratings,
  onAddRating = async () => ({ success: false }),
  canEvaluate = true,
}: UserRatingsModalProps) => {
  const [score, setScore] = useState(1);
  const [formKey, setFormKey] = useState(0);

  const [state, formAction, isPending] = useActionState(
    async (_previousState: unknown, formData: FormData) => {
      if (!canEvaluate) return { success: false, message: '' };
      
      formData.append('score', String(score));
      const result = await onAddRating(formData);

      if (result.success) {
        setScore(1); 
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
      title={`Avaliações: ${targetUserName}`}
      className={styles.modal}
    >
      <div className={styles.container} key={formKey}>
        
        <div className={styles.ratingsList}>
          {ratings && ratings.length > 0 ? (
            ratings.map((item) => (
              <div key={item.id} className={styles.ratingCard}>
                <div className={styles.cardHeader}>
                  <Link to={`/perfil/${item.userId}`} className={styles.userNameLink}>
                    {item.userName}
                  </Link>
                  <RatingStars rating={item.score} />
                </div>
                <p className={styles.comment}>{item.comment}</p>
              </div>
            ))
          ) : (
            <p className={styles.noRatingsMessage}>Este usuário ainda não possui avaliações.</p>
          )}
        </div>

        {canEvaluate && (
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
                  <RatingStarsInput name="score" value={score} onChange={setScore} />
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
        )}

      </div>
    </Modal>
  );
};