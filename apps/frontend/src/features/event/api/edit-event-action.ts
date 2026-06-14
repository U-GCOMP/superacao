import {
  FetchEventDetailsResponseDTO,
  FetchEventDetailsResponseSchema,
  RegisterEventRequestSchema,
} from '@project/shared';
import { AppError, HttpClient } from '../../../lib/http-client';

export interface EditEventActionState {
  success: boolean;
  message: string;
  event?: FetchEventDetailsResponseDTO;
}

export const editEventAction = async (
  eventId: string,
  formData: FormData,
): Promise<EditEventActionState> => {
  const title = formData.get('title');
  const description = formData.get('description');
  const maxSlots = formData.get('maxSlots');
  const place = formData.get('place');
  const startDate = formData.get('startDate');
  const endDate = formData.get('endDate');
  const startTime = formData.get('startTime');
  const image = formData.get('image');

  const validation = RegisterEventRequestSchema.safeParse({
    title,
    description,
    maxSlots,
    place,
    startDate,
    endDate,
    startTime,
    image: image instanceof File && image.size > 0 ? image : undefined,
  });

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0].message,
    };
  }

  try {
    const httpClient = HttpClient.getInstance();

    const response = await httpClient.patchFormData<FetchEventDetailsResponseDTO>(
      `/events/${eventId}`,
      formData,
    );

    const event: FetchEventDetailsResponseDTO = response;
    const parsedEvent = FetchEventDetailsResponseSchema.parse(event);

    return {
      success: true,
      message: 'Evento atualizado com sucesso!',
      event: parsedEvent,
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'Erro de conexão com o servidor.',
    };
  }
};