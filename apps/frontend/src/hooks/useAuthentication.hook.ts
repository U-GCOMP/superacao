import { AuthTokenPayload } from "@project/shared";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../router/routes";

export const AUTH_TOKEN_KEY = '@Project:token';
export const AUTH_USER_KEY = '@Project:user';

export const saveAuthSession = (token: string) => {
  const payload = jwtDecode<AuthTokenPayload>(token);

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload));
};

export const useAuthentication = () => {
    const navigate = useNavigate();
    
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (!token || !storedUser) {
      navigate(AppRoutes.LOGIN);
    }

    const user = storedUser ? JSON.parse(storedUser) : null;

    const username = user?.username ?? null;
    const id = user?.sub ?? null;
    
    const isAuthenticated = !!token;

    return { isAuthenticated, token, username, id, saveAuthSession };
}
