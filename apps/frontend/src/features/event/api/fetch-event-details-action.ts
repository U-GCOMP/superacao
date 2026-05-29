import { FetchEventDetailsResponseDTO, FetchEventDetailsResponseSchema } from "@project/shared";
import { HttpClient } from "../../../lib/http-client"

export const fetchEventDetailsAction = async (id: string): Promise<FetchEventDetailsResponseDTO> => {
    const httpClient = HttpClient.getInstance();

    const response = await httpClient.get<FetchEventDetailsResponseDTO>(`/events/${id}`);

    const parsedResponse = FetchEventDetailsResponseSchema.parse(response);

    return parsedResponse;
}
