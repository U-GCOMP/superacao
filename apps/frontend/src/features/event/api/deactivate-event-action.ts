export const deactivateEventAction = async (eventId: string): Promise<void> => {
  const token = localStorage.getItem('@Project:token');

  if (!token) {
    throw new Error('Usuário não está autenticado.');
  }

  const response = await fetch(`http://localhost:3000/events/${eventId}/deactivate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro ao desativar o evento.');
  }
};