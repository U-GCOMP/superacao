import { Navbar } from '../../components/NavBar/NavBar'
import { LoginForm } from '../../features/auth/ui/LoginForm/LoginForm';
import { Footer } from '../../components/Footer/Footer'
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

export const Login = () => {
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
        <h2 className={styles.title}>Venha fazer o bem!</h2>
        <LoginForm />

        <div className={styles.footerLinks}>
          <p>
            Não é cadastrado?{' '}
            <Link to="/cadastro" className={styles.accentText}>
              Cadastre-se
            </Link>
          </p>
          <p>
            Esqueceu a senha?{' '}
            <Link to="/recuperar-senha" className={styles.accentText}>
              Recupere-a
            </Link>
          </p>
        </div>
      </main>
      <Footer footerItems={footerLinks}></Footer>
    </div>
  );
};