import { RedefinePasswordResponseDTO, RedefinePasswordRequestSchema } from '@project/shared';

export const redefinePasswordAction = async (_: unknown, formData: FormData) => {
  const password = formData.get('password') as string;
  const passwordConfirmation = formData.get('passwordConfirmation') as string;

  if (password !== passwordConfirmation) {
    return { message: 'As senhas não coincidem. Tente novamente.', success: false };
  }

  const validation = RedefinePasswordRequestSchema.safeParse({ password })
  
  if (!validation.success) {
    return { 
      message: validation.error.issues[0].message, 
      success: false 
    };
  }

  try {
    const response = await fetch('http://localhost:3000/auth/redefinePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
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
