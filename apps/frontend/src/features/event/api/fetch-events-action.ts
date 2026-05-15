import { FetchEventQueryParametersDTO, FetchEventResponseDTO } from "@project/shared";
import { HttpClient } from "../../../lib/http-client"
import { objectToQueryParams } from "../../../utils/object-to-query-params";

export const fetchEventsAction = async (queryParameters: FetchEventQueryParametersDTO): Promise<FetchEventResponseDTO[]> => {
    // TODO: Remover mock quando backend estiver pronto
    await new Promise(resolve => setTimeout(resolve, 1000));
    // return Array.from({ length: 10 }, (_, i) => ({
    //         eventId: `event-${i + 1}`,
    //         imageUrl: "https://source.unsplash.com/random/400x200",
    //         title: "Limpeza de Praia",
    //         description: "O Mutirão do Lixo Eletrônico é um evento realizado anualmente em Presidente Prudente/SP, que tem O Mutirão do Lixo Eletrônico é um evento realizado anualmente em Presidente Prudente/SP, que tem O Mutirão do Lixo Eletrônico é um evento realizado anualmente em Presidente Prudente/SP, que tem O Mutirão do Lixo Eletrônico é um evento realizado anualmente em Presidente Prudente/SP, que tem",
    //         volunteersCount: 5,
    //         maxVolunteers: 20,
    //         status: "CANCELED",
    //         date: new Date("2024-07-15")
    //     }));
    
    const httpClient = HttpClient.getInstance();

    const queryParams = objectToQueryParams(queryParameters);

    const response = await httpClient.get<FetchEventResponseDTO[]>(`/events?${queryParams}`);
    return response;
}