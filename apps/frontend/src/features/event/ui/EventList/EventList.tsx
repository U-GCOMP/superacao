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

    const handleFilterFormSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const rawDate = formData.get(filterFormNames.date);

        const queryParams = FetchEventListQueryParametersSchema.safeParse({
            search: formData.get(filterFormNames.search),
            date: rawDate ? new Date(rawDate.toString()) : undefined,
            isDescending: formData.get(filterFormNames.orderBy) === 'descending'
        });

        if (!queryParams.success) {
            console.error(queryParams.error);
            return;
        }

        setEvents(null);
        setIsLoading(true);
        const events = await fetchEventsAction(queryParams.data);
        setEvents(events);
        setIsLoading(false);
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
                    <Dropdown label='Ordem' name={filterFormNames.orderBy} options={[{label: 'Datas mais próximas primeiro', value: 'descending'}, {label: 'Datas mais distantes primeiro', value: 'ascending'}]} />
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
                {events?.map((event, index) => (
                    <EventCardComponent key={`event-${index}`} {...event} />
                ))}
            </div>
        </section>
    )
}