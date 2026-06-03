import { useActionState } from 'react';
import { FetchEventDetailsResponseDTO } from '@project/shared';
import styles from './EventEditModal.module.css';
import { Button } from '../../../../../components/Button/Button';
import { TextInput } from '../../../../../components/TextInput/TextInput';
import { TextArea } from '../../../../../components/TextArea/TextArea';
import { DateInput } from '../../../../../components/DateInput/DateInput';
import { TimeInput } from '../../../../../components/TimeInput/TimeInput';
import { ImageInput } from '../../../../../components/ImageInput/ImageInput';
import { Modal } from '../../../../../components/Modal/Modal';
import { editEventAction, type EditEventActionState } from '../../../api/edit-event-action';

interface EventEditModalProps {
  isOpen: boolean;
  event: FetchEventDetailsResponseDTO;
  onClose: () => void;
  onSaved: (event: FetchEventDetailsResponseDTO) => void;
}

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const toTimeInputValue = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const EventEditModal = ({ isOpen, event, onClose, onSaved }: EventEditModalProps) => {
  const [state, formAction, isPending] = useActionState<EditEventActionState, FormData>(
    async (_previousState, formData) => {

      const result = await editEventAction(event.id, formData);

      if (result.success && result.event) {
        onSaved(result.event);
        onClose();
      }

      return result;
    },
    {
      success: false,
      message: '',
    },
  );

  if (!isOpen || !event) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar evento"
      description="Atualize as informações do evento e confirme para salvar as alterações."
      className={styles.modal}
    >
      <form key={event.id} className={styles.form} action={formAction}>
          <ImageInput
            key={event.id}
            name="image"
            initialImageUrl={event.imageUrl}
          />

          <TextInput
            name="title"
            type="text"
            label="Título"
            required
            defaultValue={event.title}
          />

          <TextArea
            name="description"
            label="Descrição"
            required
            rows={4}
            defaultValue={event.description}
          />

          <div className={styles.row}>
            <TextInput
              name="maxSlots"
              type="text"
              label="Máximo vagas"
              required
              defaultValue={String(event.maxVolunteers)}
            />
            <TextInput
              name="place"
              type="text"
              label="Local"
              required
              defaultValue={event.place}
            />
          </div>

          <DateInput
              name="startDate"
              label="Data início"
              required
              defaultValue={toDateInputValue(new Date(event.date))}
          />
          <DateInput
              name="endDate"
              label="Data término"
              required
              defaultValue={toDateInputValue(new Date(event.subscriptionDeadlineDate))}
          />
          <TimeInput
              name="startTime"
              label="Horário início"
              required
              defaultValue={toTimeInputValue(new Date(event.date))}
          />

          <p className={styles.statusMessage} aria-live="polite">
            {state.message}
          </p>

          <div className={styles.buttonGroup}>
            <Button className={styles.cancelButton} text="Cancelar" onClick={onClose} />
            <Button
              text={isPending ? 'Salvando...' : 'Salvar alterações'}
              type="submit"
              disabled={isPending}
            />
          </div>
      </form>
    </Modal>
  );
};