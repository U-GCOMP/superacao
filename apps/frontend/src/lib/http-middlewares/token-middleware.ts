import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../hooks/useAuthentication.hook";

export const tokenMiddeware = (statusCode: number) => {
    if (statusCode === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
    }
}