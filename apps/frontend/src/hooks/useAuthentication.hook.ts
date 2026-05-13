export const useAuthentication = () => {
    const token = localStorage.getItem('@Project:token');

    const isAuthenticated = !!token;

    return { isAuthenticated, token };
}