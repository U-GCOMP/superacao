import { Navbar } from '../../components/NavBar/NavBar'
import { RedefinePasswordForm } from '../../features/auth/ui/RedefinePasswordForm/RedefinePasswordForm';
import { Footer } from '../../components/Footer/Footer'
import styles from './RedefinePassword.module.css';

export const RedefinePassword = () => {
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
        <h2 className={styles.title}>Voltando a ajudar?</h2>
        <RedefinePasswordForm />
        <br></br>

      </main>
      <Footer footerItems={footerLinks}></Footer>
    </div>
  );
};