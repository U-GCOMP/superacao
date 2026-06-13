import styles from './EventDetails.module.css';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';
import { Button } from '../../components/Button/Button';
import { Pill } from '../../components/Pill/Pill';
import { FetchEventDetailsResponseDTO, FetchEventHistogramResponseDTO, FetchEventWordCloudResponseDTO } from '@project/shared';
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
import { UserRatingsModal } from '../../features/user/ui/components/UserRatingsModal/UserRatingsModal';
import { registerUserRatingAction } from '../../features/user/api/register-user-rating-action';
import { fetchUserDetailsAction } from '../../pages/Profile/api/fetch-user-profile-action'
import { fetchEventHistogramAction } from '../../features/event/api/fetch-event-histogram-action';
import { fetchEventWordCloudAction } from '../../features/event/api/fetch-event-word-cloud-action';

export const EventDetails = () => {
  const { id } = useParams();
  const { id: loggedUserId } = useAuthentication();

  const [event, setEvent] = useState<FetchEventDetailsResponseDTO | null>(null);
  const [eventErrorMessage, setEventErrorMessage] = useState<string | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);

  const [histogram, setHistogram] = useState<FetchEventHistogramResponseDTO['histogram']>([]);
  const histogramData = histogram.map(item => item.value);
  const histogramLabels = histogram.map(item => item.label);
  const [isHistogramError, setIsHistogramError] = useState<string | null>(null);
  const [isHistogramLoading, setIsHistogramLoading] = useState(false);

  const [wordCloudData, setWordCloudData] = useState<FetchEventWordCloudResponseDTO>([]);
  const [isWordCloudError, setIsWordCloudError] = useState<string | null>(null);
  const [isWordCloudLoading, setIsWordCloudLoading] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deactivateInput, setDeactivateInput] = useState('');
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRatingsOpen, setIsRatingsOpen] = useState(false);
  const [isUserRatingsOpen, setIsUserRatingsOpen] = useState(false);
  const [volunteerToRate, setVolunteerToRate] = useState<{id: string, name: string} | null>(null);

  const [volunteerRatings, setVolunteerRatings] = useState<{
    id: string;
    userId: string;
    userName: string;
    comment?: string | null;
    score: number;
  }[]>([]);

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
        setEventErrorMessage(error.message);
      } else {
        setEventErrorMessage('Erro desconhecido');
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
          setEventErrorMessage(error.message);
        }
      }
    };

    const fetchEvent = async (id: string) => {
      try {
        setIsLoadingEvent(true);
        setEventErrorMessage(null);
        const eventData = await fetchEventDetailsAction(id);
        setEvent(eventData);
      } catch (error) {
        if (error instanceof AppError) {
          setEventErrorMessage(error.message);
        } else {
          setEventErrorMessage('Unexpected error');
        }
        setEvent(null);
      } finally {
        setIsLoadingEvent(false);
      }
    };

    if (id) {
      fetchEvent(id);
      checkSubscription();
    }
  }, [id]);

  useEffect(() => {
    const fetchHistogram = async (id: string) => {
      try {
        setIsHistogramLoading(true);
        setIsHistogramError(null);

        const response = await fetchEventHistogramAction(id);

        setHistogram(response.histogram);
      } catch (error) {
        if (error instanceof AppError) {
          setIsHistogramError(error.message);
        } else {
          setIsHistogramError('Erro desconhecido ao carregar histograma');
        }
      } finally {
        setIsHistogramLoading(false);
      }
    }

    if (id) {
      fetchHistogram(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchWordCloud = async (id: string) => {
      try {
        setIsWordCloudLoading(true);
        setIsWordCloudError(null);
        const response = await fetchEventWordCloudAction(id, 20);
        setWordCloudData(response);
      } catch (error) {
        if (error instanceof AppError) {
          setIsWordCloudError(error.message);
        } else {
          setIsWordCloudError('Erro desconhecido ao carregar nuvem de palavras');
        }
      } finally {
        setIsWordCloudLoading(false);
      }
    }

    if (id) {
      fetchWordCloud(id);
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

  if (isLoadingEvent) {
    return (
      <BaseScreen>
        <p>Carregando...</p>
      </BaseScreen>
    );
  }

  if (!event) {
    return (
      <BaseScreen>
        <p>{eventErrorMessage}</p>
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

  const handleOpenVolunteerModal = async (volunteerId: string, volunteerName: string) => {
    setVolunteerToRate({ id: volunteerId, name: volunteerName });
    setIsUserRatingsOpen(true);
    setVolunteerRatings([]);

    try {
      const profile = await fetchUserDetailsAction({ id: Number(volunteerId) });
      
      const formattedRatings = profile.ratings.map((rating, index) => ({
        id: String(index),
        userId: String(rating.author_id),
        userName: rating.author_username,
        comment: rating.comment,
        score: rating.rating,
      }));

      setVolunteerRatings(formattedRatings);
    } catch (error) {
      console.error('Erro ao buscar histórico de avaliações do voluntário:', error);
    }
  };

  const handleAddVolunteerRating = async (formData: FormData) => {
    if (!id || !volunteerToRate) {
      return { 
        success: false, 
        message: 'ID do evento ou voluntário inválido.' 
      };
    }

    try {
      await registerUserRatingAction(volunteerToRate.id, formData);

      return { success: true, message: 'Avaliação do voluntário salva com sucesso!' };
    } catch (error) {
      if (error instanceof AppError) {
        return { success: false, message: error.message };
      }
      
      return { 
        success: false, 
        message: 'Ocorreu um erro inesperado ao salvar a avaliação.' 
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
              <span>Organizador:</span>{' '}
                {event.organizer.id === 0 ? (
                  <span className={styles.userNameLinkDeactivate}>
                    {event.organizer.name}
                  </span>
                ) : (
                  <Link to={`/perfil/${event.organizer.id}`} className={styles.userNameLink}>
                    {event.organizer.name}
                  </Link>
                )}
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

      {isCompleted && (
        <div className={styles.ownerMetricsSection}>
          <div className={styles.volunteersEvaluation}>
            <h1>Avaliar Voluntários</h1>
            <p>Selecione um voluntário participante para enviar sua avaliação sobre o desempenho dele no evento.</p>
            
            <div className={styles.volunteersList}>
              {event.volunteers && event.volunteers.length > 0 ? (
                event.volunteers.map((volunteer) => (
                  <div key={volunteer.id} className={styles.volunteerItem}>
                    <span>{volunteer.name}</span>
                    <Button 
                      text="Avaliar" 
                      buttonStyle="secondary" 
                      onClick={() => handleOpenVolunteerModal(String(volunteer.id), volunteer.name)}
                    />
                  </div>
                ))
              ) : (
                <p>Nenhum voluntário registrado para avaliação.</p>
              )}
            </div>
          </div>

          <div className={styles.histogram}>
            <h1>Histograma de avaliações</h1>
            {
              isHistogramLoading ? (
                <p>Carregando histograma...</p>
              ) : isHistogramError ? (
                <p>{isHistogramError}</p>
              ) : (
              <RatingHistogram
                ratingData={histogramData}
                ratingLabels={histogramLabels}
              />
              )
            }
          </div>

          <div className={styles.wordCloud}>
            <h1>Nuvem de palavras</h1>
            {
              isWordCloudLoading ? (
                <p>Carregando nuvem de palavras...</p>
              ) : isWordCloudError ? (
                <p>{isWordCloudError}</p>
              ) : (
                <div>
                  <WordCloudChart data={wordCloudData.map((entry) => [entry.word, entry.count])} />
                </div>
              )
            }
          </div>
        </div>
      )}
      
      {isRatingsOpen && (
        <EventRatingsModal
          isOpen={isRatingsOpen}
          onClose={() => setIsRatingsOpen(false)}
          eventName={event.title}
          ratings={event.ratings || []} 
          onAddRating={handleAddRating}
        />
      )}

      {isUserRatingsOpen && volunteerToRate && (
        <UserRatingsModal
          isOpen={isUserRatingsOpen}
          onClose={() => {
            setIsUserRatingsOpen(false);
            setVolunteerToRate(null);
          }}
          targetUserName={volunteerToRate.name}
          ratings={volunteerRatings} 
          onAddRating={handleAddVolunteerRating}
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
