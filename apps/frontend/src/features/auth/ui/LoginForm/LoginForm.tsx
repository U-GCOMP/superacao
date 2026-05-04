import { useActionState } from 'react';
import styles from '../auth.module.css';
import { loginAction } from '../../api/login-action';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { Button } from '../../../../components/Button/Button';

export const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginAction, {
    message: '',
    success: false,
  });

  return (
    <main className={styles.main}>
      <form action={formAction} className={styles.form}>
        <TextInput name="email" type="email" label="E-mail" required />
        <br></br>
        <TextInput name="password" type="password" label="Senha" required /> 
        <br></br>
        
        <Button
          text={isPending ? 'Logging in...' : 'Login'}
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
