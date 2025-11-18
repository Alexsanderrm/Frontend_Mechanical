import api from './api';

export const login = async (username: string, password: string) => {
  const response = await api.post('/clientes/login', { username, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};