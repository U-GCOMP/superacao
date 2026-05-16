import { FetchEventListItemResponseDTO, FetchEventListQueryParametersDTO,  } from "@project/shared";
import { HttpClient } from "../../../lib/http-client"
import { objectToQueryParams } from "../../../utils/object-to-query-params";

export const fetchEventsAction = async (queryParameters: FetchEventListQueryParametersDTO): Promise<FetchEventListItemResponseDTO[]> => {
    
    const httpClient = HttpClient.getInstance();

    const queryParams = objectToQueryParams(queryParameters);

    const response = await httpClient.get<FetchEventListItemResponseDTO[]>(`/events?${queryParams}`);
    return response;
}