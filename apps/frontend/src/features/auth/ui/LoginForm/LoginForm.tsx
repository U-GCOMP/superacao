import styles from '../auth.module.css';
import { useActionState, useEffect } from 'react';
import { loginAction } from '../../api/login-action';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { Button } from '../../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../../router/routes';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState(loginAction, {
    message: '',
    success: false,
  });

  useEffect(() => {
    if (state?.success) {
      // Esse setTimeout eh soh para ler a msg, mas ficou ruim
      // setTimeout(function() {
      // }, 2000);
      // mudar para tela principal, qnd tiver
      navigate(AppRoutes.EVENTS);
    }
  }, [state?.success, navigate]);

  return (
    <form action={formAction} className={styles.form}>
      <TextInput name="email" type="email" label="E-mail" required />
      <TextInput name="password" type="password" label="Senha" required /> 
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
  );
};
