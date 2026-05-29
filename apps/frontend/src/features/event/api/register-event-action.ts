import { RegisterEventResponseDTO, RegisterEventRequestSchema } from '@project/shared';

export const registerEventAction = async (_: unknown, formData: FormData) => {
  const title = formData.get('title');
  const description = formData.get('description');
  const maxSlots = formData.get('maxSlots');
  const place = formData.get('place');
  const startDate = formData.get('startDate');
  const endDate = formData.get('endDate');
  const startTime = formData.get('startTime');
  const imageURL = formData.get('imageURL');

  const validation = RegisterEventRequestSchema.safeParse({ 
    title, 
    description, 
    maxSlots, 
    place, 
    startDate, 
    endDate, 
    startTime, 
    imageURL: typeof imageURL === 'string' && imageURL.trim() !== '' ? imageURL : undefined
  });

  if (!validation.success) {
    return { 
      message: validation.error.issues[0].message, 
      success: false 
    };
  }

  try {
    const token = localStorage.getItem('@Project:token');

    const response = await fetch('http://localhost:3000/events/register', {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData, // Had to change from json to send entire formData mostly because of image
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      const errorMessage = Array.isArray(errorData.message) 
        ? errorData.message[0] 
        : errorData.message;

      return { message: errorMessage || 'Erro ao realizar o cadastro do evento.', success: false };
    }

    const data: RegisterEventResponseDTO = await response.json();
    
    return { message: 'Evento cadastrado com sucesso!', success: true };
  } catch (_) {
    return { message: 'Erro de conexão com o servidor.', success: false };
  }
};