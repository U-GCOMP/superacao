import { Navbar } from '../../components/NavBar/NavBar'
import { RegisterEventForm } from '../../features/event/ui/RegisterEventForm/RegisterEventForm';
import { Footer } from '../../components/Footer/Footer'
import styles from './RegisterEvent.module.css';

export const RegisterEvent = () => {
  const navLinks = [
    { label: 'Eventos', onClick: () => {} },
    { label: 'Meus Eventos', onClick: () => {}, isPrimary: true },
    { label: 'Cadastrar', onClick: () => {} },
  ];

  const footerLinks = [
    { label: 'Saiba Mais', onClick: () => {}},
    { label: 'Email: ', onClick: () => {}},
  ];

  return (
    <div className={styles.page}>
      <Navbar navItems={navLinks} />
      <main className={styles.content}>
        <RegisterEventForm />
      </main>
      <Footer footerItems={footerLinks}></Footer>
    </div>
  );
};