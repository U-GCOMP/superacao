import { FetchEventHistogramResponseDTO, FetchEventHistogramResponseSchema } from "@project/shared";
import { HttpClient } from "../../../lib/http-client"

export const fetchEventHistogramAction = async (id: string): Promise<FetchEventHistogramResponseDTO> => {
    const httpClient = HttpClient.getInstance();

    const response = await httpClient.get<FetchEventHistogramResponseDTO>(`/events/${id}/histogram`);

    const parsedResponse = FetchEventHistogramResponseSchema.parse(response);

    return parsedResponse;
}
