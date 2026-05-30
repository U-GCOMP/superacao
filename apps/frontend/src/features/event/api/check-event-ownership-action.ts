import { EventOwnershipResponseSchema,EventOwnershipResponseDTO } from "@project/shared";
import { HttpClient } from "../../../lib/http-client"

export const checkEventOwnershipAction = async (id: string): Promise<EventOwnershipResponseDTO> => {
    const httpClient = HttpClient.getInstance();

    const response = await httpClient.get<EventOwnershipResponseDTO>(`/events/${id}/ownership`);

    const parsedResponse = EventOwnershipResponseSchema.parse(response);

    return parsedResponse;
}
