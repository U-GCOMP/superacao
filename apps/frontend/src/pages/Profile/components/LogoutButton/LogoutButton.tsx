import { Button } from '../../../../components/Button/Button';
import styles from './LogoutButton.module.css';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../../../../hooks/useAuthentication.hook'
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../../router/routes'

interface LogoutButtonProps {
    isOwnProfile: boolean;
}

export const LogoutButton = ({ isOwnProfile }: LogoutButtonProps) => {

    const navigate = useNavigate();

    if (!isOwnProfile) {
        return null;
    }

    const handleLogout = async () => {
        try {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);

            navigate(AppRoutes.LOGIN);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <div className={styles.buttonWrapper}>
            <Button
                text='Sair da conta'
                buttonStyle='terciary'
                compact
                onClick={handleLogout}
            />
        </div>
    );
};