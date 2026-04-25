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
      return { message: errorData.message as string, success: false };
    }

    const data: LoginResponseDTO = await response.json();
    return { message: data.token, success: true };
  } catch (_) {
    return { message: 'An error occurred during login.', success: false };
  }
};
