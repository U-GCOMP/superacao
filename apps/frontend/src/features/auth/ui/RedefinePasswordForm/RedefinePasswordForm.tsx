import { useActionState } from 'react';
import styles from '../auth.module.css';
import { redefinePasswordAction } from '../../api/redefinePassword-action';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { Button } from '../../../../components/Button/Button';

export const RedefinePasswordForm = () => {
  const [state, formAction, isPending] = useActionState(redefinePasswordAction, {
    message: '',
    success: false,
  });

  return (
    <form action={formAction} className={styles.form}>
      <TextInput name="newPassword" type="password" label="Nova senha" required />
      <TextInput name="confirmNewPassword" type="password" label="Confirmar senha" required /> 
      
      <Button
        text={isPending ? 'Redefining in...' : 'Prosseguir'}
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
