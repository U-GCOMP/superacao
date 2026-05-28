export const useAuthentication = () => {
  const token = localStorage.getItem('@Project:token');
  const isAuthenticated = !!token;
  let userId = null;

  if (token) {
    try {
      const payloadBase64 = token.split('.')[1];
      
      const decodedPayload = JSON.parse(atob(payloadBase64));

      userId = decodedPayload.sub;
      
    } catch (error) {
      console.error('Falha ao decodificar o token JWT:', error);
    }
  }

  return { isAuthenticated, token, userId };
};