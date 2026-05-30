import { redirect } from 'react-router-dom';
import { AUTH_TOKEN_KEY } from '../../hooks/useAuthentication.hook';
import { AppRoutes } from '../routes';

export const protectedRouteLoader = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (!token) {
        return redirect(AppRoutes.LOGIN);
    }
    
    return null;
};