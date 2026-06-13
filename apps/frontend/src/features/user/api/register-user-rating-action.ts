import { HttpClient } from '../../../lib/http-client';
import { RegisterUserRatingResponseDTO } from '@project/shared';

export const registerUserRatingAction = async (
  targetId: string,
  formData: FormData
): Promise<RegisterUserRatingResponseDTO> => {
  const rating = Number(formData.get('score'));
  const comment = formData.get('comment')?.toString() || undefined;

  const httpClient = HttpClient.getInstance();

  const response = await httpClient.post<RegisterUserRatingResponseDTO>(
    `/user/${targetId}/rate`,
    { rating, comment }
  );

  return response;
};
