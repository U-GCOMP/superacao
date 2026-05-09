import { RedefinePasswordEmailResponseDTO, RedefinePasswordEmailRequestSchema } from '@project/shared';

export const recoverPasswordAction = async (_: unknown, formData: FormData) => {
  const email = formData.get('text') as string;

  const validation = RedefinePasswordEmailRequestSchema.safeParse({ email })
    
  if (!validation.success) {
    return { 
      message: validation.error.issues[0].message, 
      success: false 
    };
  }

  try {
    const response = await fetch('http://localhost:3000/auth/recoverPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { message: errorData.message as string, success: false };
    }

    const data: RedefinePasswordEmailResponseDTO = await response.json();
    return { message: data.token, success: true };
  } catch (_) {
    return { message: 'An error occurred during recovery.', success: false };
  }
};
