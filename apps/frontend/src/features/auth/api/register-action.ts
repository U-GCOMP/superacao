import { RegisterResponseDTO } from '@project/shared';

export const registerAction = async (_: unknown, formData: FormData) => {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const passwordConfirmation = formData.get('passwordConfirmation') as string;

  if (password !== passwordConfirmation) {
    return { message: 'As senhas não coincidem. Tente novamente.', success: false };
  }

  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      const errorMessage = Array.isArray(errorData.message) 
        ? errorData.message[0] 
        : errorData.message;

      return { message: errorMessage || 'Erro ao realizar o cadastro.', success: false };
    }

    const data: RegisterResponseDTO = await response.json();
    
    localStorage.setItem('@Project:token', data.token);

    return { message: 'Cadastro realizado com sucesso!', success: true };
  } catch (_) {
    return { message: 'Erro de conexão com o servidor.', success: false };
  }
};