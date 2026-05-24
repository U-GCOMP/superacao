import styles from "./EventDetails.module.css"
import { BaseScreen } from "../../components/BaseScreen/BaseScreen"
import { Button } from "../../components/Button/Button"
import { Pill } from "../../components/Pill/Pill"
import { FetchEventDetailsResponseDTO } from "@project/shared"
import { useEffect, useState } from "react"
import { fetchEventDetailsAction } from "../../features/event/api/fetch-event-details-action"
import { useParams } from "react-router-dom"

export const EventDetails = () => {
    const [event, setEvent] = useState<FetchEventDetailsResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOwner, _] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        const fetchEvent = async (id: string) => {
            try {
                setIsLoading(true);

                const event = await fetchEventDetailsAction(id);

                setEvent(event);
            } catch {
                setEvent(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchEvent(id);
        }
    }, [id]);

    if (isLoading) {
        return (
            <BaseScreen>
                <p>Carregando...</p>
            </BaseScreen>
        )
    }

    if (!event) {
        return (
            <BaseScreen>
                <p>Evento não encontrado</p>
            </BaseScreen>
        )
    }

    return (
        <BaseScreen>
            <div className={styles.container}>
                <div className={styles.leftContent}>
                    <div className={styles.leftUpperContent}>
                        <div className={styles.eventHeader}>
                            <h1>{event.title}</h1>
                            <h4>
                                {`Data: ${new Date(event.date).toLocaleDateString("pt-BR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}`}
                            </h4>
                        </div>

                        <div className={styles.eventContent}>
                            <p>
                                {event.description}
                            </p>
                        </div>

                        <div className={styles.eventFooter}>
                            <span>Organizador:</span>{" "}
                            <a href="#">{event.organizer.name}</a>
                        </div>
                    </div>

                    <div className={styles.leftBottomContent}>
                        <div className={styles.pills}>
                            <Pill text={`Faltam ${event.maxVolunteers - event.volunteersCount} voluntários`} pillStyle="primary" />
                            <Pill text={`${event.volunteersCount} voluntários inscritos`} pillStyle="secondary" />
                        </div>

                        {isOwner && 
                            <div className={styles.buttons}>
                                <Button text="Editar evento" buttonStyle="secondary"/>
                                <Button text="Desativar evento" buttonStyle="terciary"/>
                            </div>
                        }
                    </div>
                </div>

                <div className={styles.rightContent}>
                    <img src={event.imageUrl}/>
                    <div className={styles.subscribeBtn}>
                        <Button
                            text="Quero me inscrever!"
                            buttonStyle="subscribe"
                            disabled={isOwner || event?.status === 'COMPLETED' || event?.status === 'CANCELED'}
                        />
                    </div>
                </div>
            </div>
        </BaseScreen>
    )
}
