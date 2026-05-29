import {
    SubscribeToEventResponseDTO,
    SubscribeToEventResponseSchema
} from '@project/shared/src/dtos/event/subscribe-to-event.dto';
import { HttpClient } from '../../../lib/http-client';

export const eventSubscribeAction = async (token: string, eventId: string): Promise<SubscribeToEventResponseDTO> => {
    const httpClient = HttpClient.getInstance();

    const response = await httpClient.post<SubscribeToEventResponseDTO>(`/events/subscribe`, {
        eventId,
    }, token);

    const parsedResponse = SubscribeToEventResponseSchema.parse(response);

    return parsedResponse;
}
