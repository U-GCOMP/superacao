import { RegisterEventRatingResponseDTO, RegisterEventRatingResponseSchema } from '@project/shared';
import { HttpClient } from '../../../lib/http-client';

export const registerEventRatingAction = async (
  eventId: string,
  loggedUserId: number,
  formData: FormData
): Promise<RegisterEventRatingResponseDTO> => {
  const httpClient = HttpClient.getInstance();

  const payload = {
    target_id: eventId,
    author_id: loggedUserId,
    organized_rating: Number(formData.get('organized')),
    punctuality_rating: Number(formData.get('punctuality')),
    infrastructure_rating: Number(formData.get('infrastructure')),
    accessibility_rating: Number(formData.get('accessibility')),
    comment: formData.get('comment') ?? null,
  };

  const response = await httpClient.post<RegisterEventRatingResponseDTO>(
    `/events/${eventId}/ratings`, 
    payload
  );

  return RegisterEventRatingResponseSchema.parse(response);
};