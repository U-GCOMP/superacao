import { useActionState } from 'react';
import styles from './RegisterForm.module.css';
import { registerAction } from '../../api/register-action';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { Button } from '../../../../components/Button/Button';

export const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerAction, {
    message: '',
    success: false,
  });

  return (
    <main className={styles.main}>
      <form action={formAction} className={styles.form}>
        <TextInput name="username" type="text" label="Nome" required />
        <br></br>
        <TextInput name="email" type="email" label="Email" required />
        <br></br>
        <TextInput name="password" type="password" label="Password" required /> 
        <br></br>
        <TextInput name="passwordConfirmation" type="password" label="Confirmar senha" required /> 
        <br></br>
        
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
    </main>
  );
};
