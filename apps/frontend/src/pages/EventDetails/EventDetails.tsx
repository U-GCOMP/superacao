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
import { RatingHistogram } from '../../components/RatingHistogram/RatingHistogram';
import { WordCloudChart } from '../../components/WordCloudChart/WordCloudChart';
import { EventRatingsModal } from '../../features/event/ui/components/EventRatingsModal/EventRatingsModal';
import { RatingStars } from '../../components/RatingStars/RatingStars';
import { registerEventRatingAction } from '../../features/event/api/register-event-rating-action';
import { Link } from 'react-router-dom';

// Mock data
const ratingData = [3, 4.5, 2, 5];
const ratingLabels = ['Critério 1', 'Critério 2', 'Critério 3', 'Critério 4'];

const wordsData: [string, number][] = [
  ['organização', 120],
  ['excelente', 110],
  ['participação', 95],
  ['evento', 90],
  ['aprendizado', 85],
  ['conteúdo', 80],
  ['palestra', 75],
  ['interessante', 70],
  ['dinâmico', 65],
  ['instrutores', 60],
  ['experiência', 58],
  ['ótimo', 55],
  ['informativo', 50],
  ['didático', 48],
  ['engajamento', 45],
  ['interação', 42],
  ['recomendado', 40],
  ['conhecimento', 38],
  ['qualidade', 35],
  ['motivador', 32],
  ['inspirador', 30],
  ['produtivo', 28],
  ['acolhedor', 25],
  ['pontualidade', 22],
  ['criativo', 20],
];

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
  const [isRatingsOpen, setIsRatingsOpen] = useState(false);

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
        prevEvent ? { ...prevEvent, status: 'CANCELED' } : null,
      );

      setIsModalOpen(false);
      setDeactivateInput('');
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Falha ao desativar o evento.',
      );
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

  const averageRating = event.rating_count > 0 ? event.rating_sum / event.rating_count : 0;

  const handleAddRating = async (formData: FormData) => {
    if (!id || !loggedUserId) {
      return { 
        success: false, 
        message: 'Usuário não autenticado ou evento inválido.' 
      };
    }

    try {
      await registerEventRatingAction(id, loggedUserId, formData);

      const updatedEvent = await fetchEventDetailsAction(id);
      setEvent(updatedEvent);

      return { success: true };
    } catch (error) {
      if (error instanceof AppError) {
        return { success: false, message: error.message };
      }
      
      return { 
        success: false, 
        message: 'Ocorreu um erro inesperado ao salvar sua avaliação.' 
      };
    }
  };

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
              <span>Organizador:</span> <Link to={`/perfil/${event.organizer.id}`} className={styles.userNameLink}>
                  {event.organizer.name}
                </Link>
            </div>
          </div>

          <div className={styles.leftBottomContent}>
            {isCompleted && (
              <div 
                className={styles.ratingsTriggerContainer} 
                onClick={() => setIsRatingsOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="Ver avaliações do evento"
              >
                <RatingStars rating={averageRating} />
                <span className={styles.votesText}>
                  ({event.rating_count} {event.rating_count === 1 ? 'voto' : 'votos'})
                </span>
              </div>
            )}

            {!isCompleted && (
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
            )}

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
              objectFit: 'cover',
            }}
          />
          <div className={styles.subscribeBtn}>
            <Button
              buttonStyle="terciary"
              disabled={isOwner || isCompleted || isCanceled || isSubscribed}
              onClick={subscribeFn}
              text={
                isCanceled || isCompleted
                  ? 'Inscrições Encerradas'
                  : isSubscribed
                    ? 'Inscrito'
                    : 'Quero me inscrever!'
              }
            />
          </div>
        </div>
      </div>

      {isCompleted && isOwner && (
        <div>
          <div className={styles.histogram}>
            <h1>Histograma de avaliações</h1>
            <RatingHistogram
              ratingData={ratingData}
              ratingLabels={ratingLabels}
            />
          </div>

          <div className={styles.wordCloud}>
            <h1>Nuvem de palavras</h1>
            <div>
              <WordCloudChart data={wordsData} />
            </div>
          </div>
        </div>
      {isRatingsOpen && (
        <EventRatingsModal
          isOpen={isRatingsOpen}
          onClose={() => setIsRatingsOpen(false)}
          eventName={event.title}
          ratings={event.ratings || []} 
          onAddRating={handleAddRating}
        />
      )}

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
