import { EventOwnershipResponseSchema,EventOwnershipResponseDTO } from "@project/shared";
import { HttpClient } from "../../../lib/http-client"

export const checkEventOwnershipAction = async (token: string, id: string): Promise<EventOwnershipResponseDTO> => {
    const httpClient = HttpClient.getInstance();

    const response = await httpClient.get<EventOwnershipResponseDTO>(`/events/${id}/ownership`, token);

    const parsedResponse = EventOwnershipResponseSchema.parse(response);

    return parsedResponse;
}
