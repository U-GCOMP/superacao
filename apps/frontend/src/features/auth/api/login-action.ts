import { LoginResponseDTO } from '@project/shared';

export const loginAction = async (_: unknown, formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      const errorMessage = Array.isArray(errorData.message) 
        ? errorData.message[0] 
        : errorData.message;

      return { 
        message: errorMessage || 'E-mail ou senha incorretos.', 
        success: false 
      };
    }

    const data: LoginResponseDTO = await response.json();
    
    localStorage.setItem('@Project:token', data.token);

    return { message: 'Login realizado com sucesso!', success: true };
    
  } catch (_) {
    return { message: 'Erro de conexão com o servidor.', success: false };
  }
};
