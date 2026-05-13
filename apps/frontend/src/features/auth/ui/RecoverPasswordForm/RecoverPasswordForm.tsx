import { useActionState } from 'react';
import styles from '../auth.module.css';
import { recoverPasswordAction } from '../../api/recoverPassword-action';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { Button } from '../../../../components/Button/Button';

export const RecoverPasswordForm = () => {
  const [state, formAction, isPending] = useActionState(recoverPasswordAction, {
    message: '',
    success: false,
  });

  return (
    <form action={formAction} className={styles.form}>
      <TextInput name="email" type="email" label="E-mail" required />
      
      <Button
        text={isPending ? 'Confirming in...' : 'Prosseguir'}
        type="submit"
        disabled={isPending}
      />

      {state?.message && (
        <p style={{ color: state.success ? 'green' : 'red' }}>
          {state.message}
        </p>
      )}
    </form>
  );
};
