import { FetchUserProfileRequestDTO, FetchUserProfileResponseDTO } from "@project/shared";
import { HttpClient } from "../../../lib/http-client";

export const fetchUserDetailsAction = async (request: FetchUserProfileRequestDTO): Promise<FetchUserProfileResponseDTO> => {
    const httpClient = HttpClient.getInstance();

    const response = await httpClient.get<FetchUserProfileResponseDTO>(`/user/profile/${request.id}`);

    return response;
} 