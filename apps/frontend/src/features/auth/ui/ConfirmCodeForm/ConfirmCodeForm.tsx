import { useActionState } from 'react';
import styles from '../auth.module.css';
import { confirmCodeAction } from '../../api/confirmCode-action';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { Button } from '../../../../components/Button/Button';

export const ConfirmCodeForm = () => {
  const [state, formAction, isPending] = useActionState(confirmCodeAction, {
    message: '',
    success: false,
  });

  return (
      <form action={formAction} className={styles.form}>
        <TextInput name="code" type="text" label="Código" required />
        
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
