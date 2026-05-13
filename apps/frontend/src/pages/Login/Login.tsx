import { LoginForm } from '../../features/auth/ui/LoginForm/LoginForm';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import { AppRoutes } from '../../router/routes';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';

export const Login = () => {

  return (
    <BaseScreen>
        <div className={styles.content}>
          <h2 className={styles.title}>Venha fazer o bem!</h2>
          <LoginForm />
          <div className={styles.footerLinks}>
            <p>
              Não é cadastrado?{' '}
              <Link to={AppRoutes.REGISTER} className={styles.accentText}>
                Cadastre-se
              </Link>
            </p>
            <p>
              Esqueceu a senha?{' '}
              <Link to={AppRoutes.PASSWORD_RECOVERY} className={styles.accentText}>
                Recupere-a
              </Link>
            </p>
          </div>
        </div>
    </BaseScreen>
  );
};