import { RedefinePasswordResponseDTO } from '@project/shared';

export const redefinePasswordAction = async (_: unknown, formData: FormData) => {
  const code = formData.get('text') as string;

  try {
    const response = await fetch('http://localhost:3000/auth/redefinePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { message: errorData.message as string, success: false };
    }

    const data: RedefinePasswordResponseDTO = await response.json();
    return { message: data.token, success: true };
  } catch (_) {
    return { message: 'An error occurred during redefinition.', success: false };
  }
};
