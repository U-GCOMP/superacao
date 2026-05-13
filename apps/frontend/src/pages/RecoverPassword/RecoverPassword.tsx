import { RecoverPasswordForm } from '../../features/auth/ui/RecoverPasswordForm/RecoverPasswordForm';
import { Link } from 'react-router-dom';
import styles from './RecoverPassword.module.css';
import { AppRoutes } from '../../router/routes';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';

export const RecoverPassword = () => {
  return (
    <BaseScreen>
      <main className={styles.content}>
        <h2>Falta um pouquinho...</h2>
        <RecoverPasswordForm />

        <div className={styles.footerLinks}>
          <p>
            Não é cadastrado?{' '}
            <Link to={AppRoutes.REGISTER} className={styles.accentText}>
              Cadastre-se
            </Link>
          </p>
        </div>
      </main>
    </BaseScreen>
  );
};