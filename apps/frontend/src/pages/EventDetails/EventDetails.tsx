import styles from './EventDetails.module.css';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';
import { TextPopUp } from '../../components/TextPopUp/TextPopUp';
import { Button } from '../../components/Button/Button';
import { Pill } from '../../components/Pill/Pill';
import { FetchEventDetailsResponseDTO } from '@project/shared';
import { useEffect, useState } from 'react';
import { fetchEventDetailsAction } from '../../features/event/api/fetch-event-details-action';
import { useParams } from 'react-router-dom';
import { useAuthentication } from '../../hooks/useAuthentication.hook';
import { deactivateEventAction } from '../../features/event/api/deactivate-event-action';

export const EventDetails = () => {
  const [event, setEvent] = useState<FetchEventDetailsResponseDTO | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deactivateInput, setDeactivateInput] = useState('');
  const [isDeactivating, setIsDeactivating] = useState(false);

  const { id } = useParams();

  const { isAuthenticated, userId } = useAuthentication();

  const isOwner = isAuthenticated && event && userId 
    ? String(event.organizer.id) === String(userId) 
    : false;

  useEffect(() => {
    const fetchEvent = async (id: string) => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const eventData = await fetchEventDetailsAction(id);
        setEvent(eventData);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Unexpected error');
        }
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEvent(id);
    }
  }, [id]);

  const handleConfirmDeactivation = async () => {
    if (!id || deactivateInput !== 'Desativar') return;

    try {
      setIsDeactivating(true);
      
      await deactivateEventAction(id);

      setEvent((prevEvent) => 
        prevEvent ? { ...prevEvent, status: 'CANCELED' } : null
      );
      
      setIsModalOpen(false);
      setDeactivateInput('');

    } catch (error) {
      alert(error instanceof Error ? error.message : 'Falha ao desativar o evento.');
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDeactivateInput('');
  };

  if (isLoading) {
    return (
      <BaseScreen>
        <p>Carregando...</p>
      </BaseScreen>
    );
  }

  if (!event) {
    return (
      <BaseScreen>
        <p>{errorMessage}</p>
      </BaseScreen>
    );
  }

  const isCanceled = event.status === 'CANCELED';
  const isCompleted = event.status === 'COMPLETED';

  return (
    <BaseScreen>
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={styles.leftUpperContent}>
            <div className={styles.eventHeader}>
              <h1>{event.title}</h1>
              <h4>
                {`Data: ${new Date(event.date).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}`}
              </h4>
              {isCanceled && (
                <span className={styles.canceledBadge}>EVENTO CANCELADO</span>
              )}
            </div>

            <div className={styles.eventContent}>
              <p>{event.description}</p>
            </div>

            <div className={styles.eventFooter}>
              <span>Organizador:</span> <a href="#">{event.organizer.name}</a>
            </div>
          </div>

          <div className={styles.leftBottomContent}>
            <div className={styles.pills}>
              <Pill
                text={`Faltam ${event.maxVolunteers - event.volunteersCount} voluntários`}
                pillStyle="primary"
              />
              <Pill
                text={`${event.volunteersCount} voluntários inscritos`}
                pillStyle="secondary"
              />
            </div>

            {isOwner && (
              <div className={styles.buttons}>
                <Button text="Editar evento" buttonStyle="secondary" disabled={isCanceled || isCompleted} />
                <Button 
                  text="Desativar evento" 
                  buttonStyle="terciary" 
                  onClick={() => setIsModalOpen(true)} 
                  disabled={isCanceled || isCompleted} 
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightContent}>
          <img 
            src={event.imageUrl} 
            alt={`Capa do evento ${event.title}`}
            style={{ 
              filter: isCanceled ? 'grayscale(100%)' : 'none',
              transition: 'filter 0.3s ease',
              objectFit: 'cover'
            }} 
          />
          <div className={styles.subscribeBtn}>
            <Button
              text={isCanceled || isCompleted ? "Inscrições Encerradas" : "Quero me inscrever!"}
              buttonStyle="terciary"
              disabled={isOwner || isCompleted || isCanceled}
            />
          </div>
        </div>
      </div>

      <TextPopUp 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDeactivation}
        title="Desativar Evento"
        description="Atenção: Esta ação não pode ser desfeita. Novas inscrições serão bloqueadas imediatamente."
        confirmText="Desativar"
        value={deactivateInput}
        onChange={setDeactivateInput}
        labelCancel="Cancelar"
        labelConfirm={isDeactivating ? "Desativando..." : "Confirmar"}
      />
    </BaseScreen>
  );
};
