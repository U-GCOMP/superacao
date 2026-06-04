import {
  FetchEventDetailsResponseDTO,
  RegisterEventRequestSchema,
} from '@project/shared';

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
    // const httpClient = HttpClient.getInstance();

    // const response = await httpClient.patch<FetchEventDetailsResponseDTO>(
    //   `/events/${eventId}`,
    //   formData,
    // );

    // const event: FetchEventDetailsResponseDTO = response;
    // const parsedEvent = FetchEventDetailsResponseSchema.parse(event);
    
    // TODO: Substituir mockedData por valor retornado do backend
    const mockedData: FetchEventDetailsResponseDTO = {
        id: eventId,
        title: String(title),
        description: String(description),
        place: String(place),
        date: new Date(String(startDate)),
        subscriptionDeadlineDate: new Date(String(endDate)),
        maxVolunteers: Number(maxSlots),
        volunteersCount: 0,
        imageUrl: 'https://i.ibb.co/pvnYzhb4/fundo.jpg',
        status: 'SCHEDULED',
        organizer: {
            id: Number(JSON.parse(localStorage.getItem('@Project:user')!)['sub']),
            name: 'Organizador Exemplo',
        }
    }

    return {
      success: true,
      message: 'Evento atualizado com sucesso!',
      event: mockedData,
    };
  } catch (error) {
    if (error instanceof Error) {
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