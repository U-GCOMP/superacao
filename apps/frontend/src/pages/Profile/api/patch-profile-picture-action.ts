import { UpdateImageRequestDTO, UpdateImageResponseDTO } from '@project/shared';
import { HttpClient } from '../../../lib/http-client';

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Não foi possível ler a imagem selecionada.'));
    };

    reader.onerror = () => {
      reject(new Error('Não foi possível ler a imagem selecionada.'));
    };

    reader.readAsDataURL(file);
  });
};

export const patchProfilePictureAction = async (
  file: File,
  id: number,
): Promise<UpdateImageResponseDTO> => {
  const httpClient = HttpClient.getInstance();
  const imageURL = await fileToDataUrl(file);

  const request: UpdateImageRequestDTO = {
    id,
    imageURL,
  };

  return httpClient.patch<UpdateImageResponseDTO>('/user/update-image', request);
};