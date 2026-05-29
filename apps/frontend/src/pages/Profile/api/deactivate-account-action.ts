import { DisableUserResponseDTO } from "@project/shared";
import { HttpClient } from "../../../lib/http-client"

export const deactivateAccountAction = async () => {
    const httpClient = HttpClient.getInstance();

    const response = await httpClient.patch<DisableUserResponseDTO>('/user/disable', {});
    httpClient.clearAuthSession();

    return response;
}