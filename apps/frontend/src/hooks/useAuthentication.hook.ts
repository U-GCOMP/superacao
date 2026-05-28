import { jwtDecode } from "jwt-decode";

interface AuthTokenPayload {
  sub: number;
  username: string;
  email: string;
}

const AUTH_TOKEN_KEY = '@Project:token';
const AUTH_USER_KEY = '@Project:user';

export const saveAuthSession = (token: string) => {
  const payload = jwtDecode<AuthTokenPayload>(token);

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload));
};

export const useAuthentication = () => {
    
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    const user = storedUser ? JSON.parse(storedUser) : null;

    const username = user?.username ?? null;
    const id = user?.sub ?? null;
    
    const isAuthenticated = !!token;

    return { isAuthenticated, token, username, id, saveAuthSession };
}