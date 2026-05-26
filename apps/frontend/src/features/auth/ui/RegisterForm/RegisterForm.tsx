import { useActionState } from 'react';
import styles from '../auth.module.css';
import { registerAction } from '../../api/register-action';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { Button } from '../../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const navigate = useNavigate();

  const actionWithRedirect = async (prevState: any, formData: FormData) => {
    const result = await registerAction(prevState, formData);
    
    if (result.success) {
      navigate('/');
    }
    
    return result;
  };

  const [state, formAction, isPending] = useActionState(actionWithRedirect, {
    message: '',
    success: false,
  });

  return (
    <form action={formAction} className={styles.form}>
      <TextInput name="username" type="text" label="Nome" required />
      <TextInput name="email" type="email" label="Email" required />
      <TextInput name="password" type="password" label="Password" required /> 
      <TextInput name="passwordConfirmation" type="password" label="Confirmar senha" required /> 
      
      <Button
        text={isPending ? 'Registering in...' : 'Cadastrar'}
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
