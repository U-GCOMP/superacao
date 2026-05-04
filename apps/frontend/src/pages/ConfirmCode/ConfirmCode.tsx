import { Navbar } from '../../components/NavBar/NavBar'
import { ConfirmCodeForm } from '../../features/auth/ui/ConfirmCodeForm/ConfirmCodeForm';
import { Footer } from '../../components/Footer/Footer'
import styles from './ConfirmCode.module.css';

export const ConfirmCode = () => {
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
        <ConfirmCodeForm />

        <div className={styles.footerLinks}>
          <p>Não recebeu? <span className={styles.accentText}>Enviar novamente</span></p>
        </div>
      </main>
      <Footer footerItems={footerLinks}></Footer>
    </div>
  );
};