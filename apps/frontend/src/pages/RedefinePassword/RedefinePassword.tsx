import { RedefinePasswordForm } from '../../features/auth/ui/RedefinePasswordForm/RedefinePasswordForm';
import styles from './RedefinePassword.module.css';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';

export const RedefinePassword = () => {
  return (
    <BaseScreen>
      <main className={styles.content}>
        <h2>Voltando a ajudar?</h2>
        <RedefinePasswordForm />
      </main>
    </BaseScreen>
  );
};