import { useActionState } from 'react';
import styles from '../auth.module.css';
import { recoverPasswordAction } from '../../api/recoverPassword-action';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { Button } from '../../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

export const RecoverPasswordForm = () => {
  const navigate = useNavigate();

  const actionWithRedirect = async (prevState: any, formData: FormData) => {
    const result = await recoverPasswordAction(prevState, formData);
    
    if (result.success) {
      navigate('/confirmar-codigo');
    }
    
    return result;
  };

  const [state, formAction, isPending] = useActionState(actionWithRedirect, {
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
