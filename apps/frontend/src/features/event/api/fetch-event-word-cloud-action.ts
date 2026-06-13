import { FetchEventWordCloudResponseDTO, FetchEventWordCloudResponseSchema } from "@project/shared";
import { HttpClient } from "../../../lib/http-client"

export const fetchEventWordCloudAction = async (id: string, limit: number): Promise<FetchEventWordCloudResponseDTO> => {
    const httpClient = HttpClient.getInstance();

    const response = await httpClient.get<FetchEventWordCloudResponseDTO>(`/events/${id}/word-cloud?limit=${limit}`);

    const parsedResponse = FetchEventWordCloudResponseSchema.parse(response);

    return parsedResponse;
}
