import styles from './EventDetails.module.css';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';
import { Button } from '../../components/Button/Button';
import { Pill } from '../../components/Pill/Pill';
import { FetchEventDetailsResponseDTO } from '@project/shared';
import { useEffect, useState } from 'react';
import { fetchEventDetailsAction } from '../../features/event/api/fetch-event-details-action';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthentication } from '../../hooks/useAuthentication.hook';
import { AppRoutes } from '../../router/routes';
import { eventSubscribeAction } from '../../features/event/api/event-subscribe-action';
import { HttpError } from '../../lib/http-client';
import { checkEventSubscriptionAction } from '../../features/event/api/check-event-subscription-action';
import { checkEventOwnershipAction } from '../../features/event/api/check-event-ownership-action';

export const EventDetails = () => {
  const navigate = useNavigate();

  const [event, setEvent] = useState<FetchEventDetailsResponseDTO | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { isAuthenticated, token } = useAuthentication();

  const { id } = useParams();

  const subscribeFn = async () => {
    if (!isAuthenticated || !token) {
      navigate(AppRoutes.LOGIN);
      return;
    }

    if (isSubscribed) {
      alert('Já inscrito no evento');
      return;
    }

    if (!id) {
      return;
    }

    try {
      const subscription = await eventSubscribeAction(token, id);

      setIsSubscribed(true);
      console.log(subscription);
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 409) {
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
        if (!token || !id) {
          setIsSubscribed(false);
          return;
        }

        const subscription = await checkEventSubscriptionAction(token, id);

        setIsSubscribed(subscription.subscribed);
      } catch (error) {
        if (error instanceof HttpError) {
          setErrorMessage(error.message);
        }
      }
    };

    const checkOwnership = async (): Promise<void> => {
      try {
        if (!token || !id) {
          setIsOwner(false);
          return;
        }

        const ownership = await checkEventOwnershipAction(token, id);

        setIsOwner(ownership.owns);
      } catch (error) {
        if (error instanceof HttpError) {
          setErrorMessage(error.message);
        }
      }
    };

    const fetchEvent = async (id: string) => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const event = await fetchEventDetailsAction(id);

        setEvent(event);
      } catch (error) {
        if (error instanceof HttpError) {
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
      checkOwnership();
    }
  }, [id, isAuthenticated, token]);

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
                <Button text="Editar evento" buttonStyle="secondary" />
                <Button text="Desativar evento" buttonStyle="terciary" />
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightContent}>
          <img src={event.imageUrl} />
          <div className={styles.subscribeBtn}>
            <Button
              text={isSubscribed ? 'Inscrito' : 'Quero me inscrever!'}
              buttonStyle="terciary"
              disabled={
                isOwner ||
                event?.status === 'COMPLETED' ||
                event?.status === 'CANCELED' ||
                isSubscribed
              }
              onClick={subscribeFn}
            />
          </div>
        </div>
      </div>
    </BaseScreen>
  );
};
