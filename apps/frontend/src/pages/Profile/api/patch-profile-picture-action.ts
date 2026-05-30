import { UpdateImageResponseDTO, UpdateImageRequestSchema } from '@project/shared';

export const patchProfilePictureAction = async (formData: FormData) => {
  const image = formData.get('image');

  const validation = UpdateImageRequestSchema.safeParse({
    image: image instanceof File && image.size > 0 ? image : undefined,
  });

  if (!validation.success) {
    return {
      message: validation.error.issues[0].message,
      success: false,
    };
  }

  try {
    const token = localStorage.getItem('@Project:token');

    const response = await fetch('http://localhost:3000/user/update-image', {
      method: 'PATCH',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData, 
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = Array.isArray(errorData.message)
        ? errorData.message[0]
        : errorData.message;

      return { 
        message: errorMessage || 'Erro ao atualizar foto de perfil.', 
        success: false 
      };
    }

    const data: UpdateImageResponseDTO = await response.json();

    return {
      message: 'Foto de perfil atualizada com sucesso!',
      success: true,
      data, 
    };
  } catch (_) {
    return { 
      message: 'Erro de conexão com o servidor.', 
      success: false 
    };
  }
};