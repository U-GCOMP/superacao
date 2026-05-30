import { UpdateUsernameRequestDTO, UpdateUsernameResponseDTO } from '@project/shared';
import { HttpClient } from '../../../lib/http-client';

export const patchUserUsernameAction = async (
  username: string,
  id: number,
): Promise<UpdateUsernameResponseDTO> => {
  const httpClient = HttpClient.getInstance();

  const request: UpdateUsernameRequestDTO = {
    username,
    id,
  };

  return httpClient.patch<UpdateUsernameResponseDTO>('/user/update-username', request);
};