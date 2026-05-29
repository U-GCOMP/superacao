import { EventSubscriptionResponseDTO, EventSubscriptionResponseSchema } from "@project/shared";
import { HttpClient } from "../../../lib/http-client"

export const checkEventSubscriptionAction = async (token: string, id: string): Promise<EventSubscriptionResponseDTO> => {
    const httpClient = HttpClient.getInstance();

    const response = await httpClient.get<EventSubscriptionResponseDTO>(`/events/${id}/subscription`, token);

    const parsedResponse = EventSubscriptionResponseSchema.parse(response);

    return parsedResponse;
}
