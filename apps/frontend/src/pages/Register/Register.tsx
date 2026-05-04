import { Navbar } from '../../components/NavBar/NavBar'
import { RegisterForm } from '../../features/auth/ui/RegisterForm/RegisterForm';
import { Footer } from '../../components/Footer/Footer'
import styles from './Register.module.css';

export const Register = () => {
  const navLinks = [
    { label: 'Eventos', onClick: () => {} },
    { label: 'Meus Eventos', onClick: () => {} },
    { label: 'Cadastrar', onClick: () => {}, isPrimary: true },
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
        <RegisterForm />

        <div className={styles.footerLinks}>
          <p>Já é cadastrado? <span className={styles.accentText}>Faça login</span></p>
        </div>
      </main>
      <Footer footerItems={footerLinks}></Footer>
    </div>
  );
};