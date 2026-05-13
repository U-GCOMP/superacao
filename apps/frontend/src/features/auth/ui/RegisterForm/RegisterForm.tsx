import { useActionState } from 'react';
import styles from '../auth.module.css';
import { registerAction } from '../../api/register-action';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { Button } from '../../../../components/Button/Button';

export const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerAction, {
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
