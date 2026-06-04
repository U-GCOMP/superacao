import styles from './EventDetails.module.css';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';
import { Button } from '../../components/Button/Button';
import { Pill } from '../../components/Pill/Pill';
import { FetchEventDetailsResponseDTO } from '@project/shared';
import { useEffect, useState } from 'react';
import { fetchEventDetailsAction } from '../../features/event/api/fetch-event-details-action';
import { useParams } from 'react-router-dom';
import { useAuthentication } from '../../hooks/useAuthentication.hook';
import { eventSubscribeAction } from '../../features/event/api/event-subscribe-action';
import { AppError } from '../../lib/http-client';
import { checkEventSubscriptionAction } from '../../features/event/api/check-event-subscription-action';
import { deactivateEventAction } from '../../features/event/api/deactivate-event-action';
import { EventEditModal } from '../../features/event/ui/components/EventEditModal/EventEditModal';
import { TextPopUp } from '../../components/TextPopUp/TextPopUp';

export const EventDetails = () => {
  const { id } = useParams();
  const { id: loggedUserId } = useAuthentication();
  

  const [event, setEvent] = useState<FetchEventDetailsResponseDTO | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deactivateInput, setDeactivateInput] = useState('');
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isOwner = event?.organizer.id === loggedUserId;

  const subscribeFn = async () => {
    if (isSubscribed) {
      alert('Já inscrito no evento');
      return;
    }

    if (!id) {
      return;
    }

    try {
      await eventSubscribeAction(id);

      setIsSubscribed(true);
    } catch (error) {
      if (error instanceof AppError) {
        if (error.statusCode === 409) {
          alert('Já inscrito no evento');
        }
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Erro desconhecido');
      }
    }
  };

  useEffect(() => {
    const checkSubscription = async (): Promise<void> => {
      try {
        if (!id) {
          setIsSubscribed(false);
          return;
        }

        const subscription = await checkEventSubscriptionAction(id);

        setIsSubscribed(subscription.subscribed);
      } catch (error) {
        if (error instanceof AppError) {
          setErrorMessage(error.message);
        }
      }
    };

    const fetchEvent = async (id: string) => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const eventData = await fetchEventDetailsAction(id);
        setEvent(eventData);
      } catch (error) {
        if (error instanceof AppError) {
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
      checkSubscription();
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

  const handleSavedEvent = (updatedEvent: FetchEventDetailsResponseDTO) => {
    setEvent(updatedEvent);
    setIsEditing(false);
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

              {isCompleted && (
                <span className={styles.completedBadge}>EVENTO CONCLUÍDO</span>
              )}
            </div>

            <div className={styles.eventContent}>
              <p>{event.description}</p>
            </div>

            <div className={styles.eventFooter}>
              <span>Local:</span> <span>{event.place}</span>
            </div>

            <div className={styles.eventFooter}>
              <span>Organizador:</span> <span>{event.organizer.name}</span>
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
                <Button 
                  text="Editar evento" 
                  buttonStyle="secondary" 
                  onClick={() => setIsEditing(true)} 
                  disabled={isCanceled || isCompleted}
                />
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
              buttonStyle="terciary"
              disabled={
                isOwner ||
                isCompleted ||
                isCanceled ||
                isSubscribed
              }
              onClick={subscribeFn}
              text={isCanceled || isCompleted ? "Inscrições Encerradas" : isSubscribed ? "Inscrito" : "Quero me inscrever!"}
            />
          </div>
        </div>
      </div>

      <EventEditModal
        isOpen={isEditing}
        event={event}
        onClose={() => setIsEditing(false)}
        onSaved={handleSavedEvent}
      />

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
        labelConfirm={isDeactivating ? 'Desativando...' : 'Confirmar'}
      />
    </BaseScreen>
  );
};
