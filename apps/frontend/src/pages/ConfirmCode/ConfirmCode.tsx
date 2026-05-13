import { ConfirmCodeForm } from '../../features/auth/ui/ConfirmCodeForm/ConfirmCodeForm';
import styles from './ConfirmCode.module.css';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';

export const ConfirmCode = () => {

  return (
    <BaseScreen>
      <main className={styles.content}>
        <h2 className={styles.title}>Falta um pouquinho...</h2>
        <ConfirmCodeForm />

        <div className={styles.footerLinks}>
          <p>Não recebeu? <span className={styles.accentText}>Enviar novamente</span></p>
        </div>
      </main>
    </BaseScreen>
  );
};