import { RegisterForm } from '../../features/auth/ui/RegisterForm/RegisterForm';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';
import { AppRoutes } from '../../router/routes';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';

export const Register = () => {

  return (
    <BaseScreen>
      <main className={styles.content}>
        <h2>Venha fazer o bem!</h2>
        <RegisterForm />

        <div className={styles.footerLinks}>
          <p>
            Já é cadastrado?{' '}
            <Link to={AppRoutes.LOGIN} className={styles.accentText}>
              Faça login
            </Link>
          </p>
        </div>
      </main>
    </BaseScreen>
  );
};