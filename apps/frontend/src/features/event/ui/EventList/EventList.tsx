import { FetchEventListQueryParametersSchema, FetchEventListItemResponseDTO } from '@project/shared';
import { DateInput } from '../../../../components/DateInput/DateInput';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { EventCardComponent } from '../components/EventCardComponent/EventCardComponent';
import styles from './EventList.module.css';
import { useEffect, useState } from 'react';
import { fetchEventsAction } from '../../api/fetch-events-action';
import { Button } from '../../../../components/Button/Button';
import { Dropdown } from '../../../../components/Dropdown/Dropdown';

export const EventList = () => {
    const [events, setEvents] = useState<FetchEventListItemResponseDTO[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isEmpty = !isLoading && events?.length === 0;

    const filterFormNames = {
        search: 'eventNameSearch',
        orderBy: 'eventOrderBy',
        date: 'eventDate'
    }
    
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            const events = await fetchEventsAction({});
            setEvents(events);
            setIsLoading(false);
        };

        fetchInitialData();
    }, []);

    const handleFilterFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const rawDate = formData.get(filterFormNames.date)?.toString().trim();
        const rawSearch = formData.get(filterFormNames.search)?.toString().trim();
        const rawOrderBy = formData.get(filterFormNames.orderBy)?.toString();

        const parsedData = {
            search: rawSearch || undefined,
            date: rawDate ? new Date(rawDate) : undefined, 
            isDescending: rawOrderBy === 'descending'
        };

        const queryParams = FetchEventListQueryParametersSchema.safeParse(parsedData);

        if (!queryParams.success) {
            console.error('Erro de validação dos filtros:', queryParams.error.format());
            return;
        }

        setEvents(null);
        setIsLoading(true);
        
        try {
            const events = await fetchEventsAction(queryParams.data);
            setEvents(events);
        } catch (error) {
            console.error('Erro ao buscar eventos filtrados:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className={styles.section}>
            <div className={styles.filtersContainer}>
                <h4>Filtros</h4>
                <form className={styles.filtersForm} onSubmit={handleFilterFormSubmit}>
                    <TextInput
                        label='Procure por um evento'
                        name={filterFormNames.search}
                    />
                    <Dropdown
                        label='Ordem'
                        name={filterFormNames.orderBy}
                        options={[
                            {label: 'Datas mais próximas primeiro', value: 'ascending'},
                            {label: 'Datas mais distantes primeiro', value: 'descending'}
                        ]}
                    />
                    <DateInput
                        label='Data'
                        name={filterFormNames.date}
                    />
                    <Button text='Buscar' type='submit' buttonStyle='secondary' />
                </form>
            </div>
            <div className={styles.eventsContainer}>
                {isLoading && <p>Carregando...</p>}
                {isEmpty && <p>Nenhum evento encontrado.</p>}
                {events?.map((event, index) => {
                    const isCanceled = event.status === 'CANCELED';

                    return (
                    <div
                        style={{ 
                            filter: isCanceled ? 'grayscale(100%)' : 'none',
                            transition: 'filter 0.3s ease'
                        }}
                    >
                        <EventCardComponent key={`event-${index}`} {...event} />
                    </div>
                    )
                })}
            </div>
        </section>
    )
}