import { Navbar } from '../../components/NavBar/NavBar'
import { RecoverPasswordForm } from '../../features/auth/ui/RecoverPasswordForm/RecoverPasswordForm';
import { Footer } from '../../components/Footer/Footer'
import { Link } from 'react-router-dom';
import styles from './RecoverPassword.module.css';

export const RecoverPassword = () => {
  const navLinks = [
    { label: 'Eventos', onClick: () => {} },
    { label: 'Meus Eventos', onClick: () => {} },
    { label: 'Entrar', onClick: () => {}, isPrimary: true },
  ];

  const footerLinks = [
    { label: 'Saiba Mais', onClick: () => {}},
    { label: 'Email: ', onClick: () => {}},
  ];

  return (
    <div className={styles.page}>
      <Navbar navItems={navLinks} />
      <main className={styles.content}>
        <h2 className={styles.title}>Falta um pouquinho...</h2>
        <RecoverPasswordForm />

        <div className={styles.footerLinks}>
          <p>
            Não é cadastrado?{' '}
            <Link to="/cadastro" className={styles.accentText}>
              Cadastre-se
            </Link>
          </p>
        </div>
      </main>
      <Footer footerItems={footerLinks}></Footer>
    </div>
  );
};