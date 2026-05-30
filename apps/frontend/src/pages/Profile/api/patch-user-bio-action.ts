import { UpdateBioRequestDTO, UpdateBioResponseDTO } from '@project/shared';
import { HttpClient } from '../../../lib/http-client';

export const patchUserBioAction = async (
  bio: string,
  id: number,
): Promise<UpdateBioResponseDTO> => {
  const httpClient = HttpClient.getInstance();

  const request: UpdateBioRequestDTO = {
    bio,
    id,
  };

  return httpClient.patch<UpdateBioResponseDTO>('/user/update-bio', request);
};