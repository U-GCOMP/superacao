import { RegisterEventResponseDTO, RegisterEventRequestSchema } from '@project/shared';

export const registerEventAction = async (_: unknown, formData: FormData) => {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const maxSlots = formData.get('maxSlots');
  const place = formData.get('place') as string;
  const date = formData.get('date');
  const startTime = formData.get('startTime') as string;
  const image = formData.get('image');

  const validation = RegisterEventRequestSchema.safeParse({ title, description, maxSlots, place, date, startTime, image });

  if (!validation.success) {
    return { 
      message: validation.error.issues[0].message, 
      success: false 
    };
  }

  try {
    const response = await fetch('http://localhost:3000/event/register', {
      method: 'POST',
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
    
    localStorage.setItem('@Project:token', data.token);

    return { message: 'Evento cadastrado com sucesso!', success: true };
  } catch (_) {
    return { message: 'Erro de conexão com o servidor.', success: false };
  }
};