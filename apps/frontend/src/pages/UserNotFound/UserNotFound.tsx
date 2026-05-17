import styles from './UserNotFound.module.css';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';
import logo from '../../assets/icons/sad-face-in-rounded-square-svgrepo-com 1.svg';

export const UserNotFound = () => {
  return (
    <BaseScreen>
      <main className={styles.content}>
        <h2 className={styles.title}>
            Usuário não encontrado...
        </h2>
        <img src={logo} alt="Sadface Logo" className={styles.logo} />

      </main>
    </BaseScreen>
  );
};