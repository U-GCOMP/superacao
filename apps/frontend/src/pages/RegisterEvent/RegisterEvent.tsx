import { RegisterEventForm } from '../../features/event/ui/RegisterEventForm/RegisterEventForm';
import styles from './RegisterEvent.module.css';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';

export const RegisterEvent = () => {

  return (
    <BaseScreen>
      <main className={styles.content}>
        <RegisterEventForm />
      </main>
    </BaseScreen>
  );
};