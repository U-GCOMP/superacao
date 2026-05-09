import { ConfirmCodeResponseDTO, ConfirmCodeRequestSchema } from '@project/shared';

export const confirmCodeAction = async (_: unknown, formData: FormData) => {
  const code = formData.get('text') as string;

  const validation = ConfirmCodeRequestSchema.safeParse({ code })
    
  if (!validation.success) {
    return { 
      message: validation.error.issues[0].message, 
      success: false 
    };
  }

  try {
    const response = await fetch('http://localhost:3000/auth/confirmCode', {
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

    const data: ConfirmCodeResponseDTO = await response.json();
    return { message: data.token, success: true };
  } catch (_) {
    return { message: 'An error occurred during confirmation.', success: false };
  }
};
