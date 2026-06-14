import { FetchEventListItemResponseDTO } from '@project/shared';
import styles from './EventCarousel.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '../../../../../hooks/useCarousel.hook';
import { generatePath, useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../../../router/routes';

interface EventCarouselProps {
    events: FetchEventListItemResponseDTO[];
}

export const EventCarousel = ({ events }: EventCarouselProps) => {
    const { carouselRef, canScrollLeft, canScrollRight, scrollCarousel } = useCarousel(events);
    
    if (events.length === 0) {
        return <></>;
    }
    
    return (
        <div className={styles.container}>
            {
                canScrollLeft && (
                    <button className={`${styles.navigationButton} ${styles.leftButton}`} onClick={() => scrollCarousel('left')}>
                        <ChevronLeft color='white' size={32} />
                    </button>
                )
            }
            <div className={styles.carousel} ref={carouselRef}>
                {events.map((event) => (
                    <EventCarouselItem key={event.eventId} event={event} />
                ))}
            </div>
            {
                canScrollRight && (
                    <button className={`${styles.navigationButton} ${styles.rightButton}`} onClick={() => scrollCarousel('right')}>
                        <ChevronRight color='white' size={32} />
                    </button>
                )
            }
        </div>
    )
}

const EventCarouselItem = ({ event }: { event: FetchEventListItemResponseDTO }) => {
    const navigate = useNavigate();

    const imageUrl = event.imageUrl && !event.imageUrl.startsWith('http')
          ? `http://localhost:3000/events/image/${event.imageUrl}`
          : (event.imageUrl ?? 'https://i.ibb.co/pvnYzhb4/fundo.jpg')
    
    return (
        <button className={styles.card} onClick={() => navigate(generatePath(AppRoutes.DETAIL_EVENT, { id: event.eventId }))}>
            <div className={styles.cardContent}>
                <img src={imageUrl} alt="" role='presentation' />
                <div className={styles.cardInfo}>
                    <p>{event.description}</p>
                </div>
            </div>
            <div className={styles.cardFooter}>
                <span>{event.title}</span>
            </div>
        </button>
    )
}