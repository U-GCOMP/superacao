import { RedefinePasswordResponseDTO, RedefinePasswordRequestSchema } from '@project/shared';

export const redefinePasswordAction = async (_: any, formData: FormData) => {
  const newPassword = formData.get('newPassword') as string;
  const confirmNewPassword = formData.get('confirmNewPassword') as string;

  if (newPassword !== confirmNewPassword) {
    return { message: 'As senhas não coincidem. Tente novamente.', success: false };
  }

  const validation = RedefinePasswordRequestSchema.safeParse({ newPassword });
  
  if (!validation.success) {
    return { 
      message: validation.error.issues[0].message, 
      success: false 
    };
  }

  const resetToken = sessionStorage.getItem('reset_token');

  if (!resetToken) {
    return { message: 'Sessão expirada. Por favor, reinicie a recuperação de senha.', success: false };
  }

  try {
    const response = await fetch('http://localhost:3000/auth/redefinePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resetToken}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { message: errorData.message as string, success: false };
    }

    const data: RedefinePasswordResponseDTO = await response.json();
    
    sessionStorage.removeItem('reset_token');

    return { message: 'Senha redefinida com sucesso!', success: true };
    
  } catch (error) {
    return { message: 'Um erro ocorreu durante a redefinição de senha.', success: false };
  }
};
