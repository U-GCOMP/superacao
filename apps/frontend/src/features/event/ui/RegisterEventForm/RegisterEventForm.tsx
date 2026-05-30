import { useActionState } from 'react';
import styles from '../event.module.css';
import { registerEventAction } from '../../api/register-event-action';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { TextArea } from '../../../../components/TextArea/TextArea';
import { Button } from '../../../../components/Button/Button';
import { DateInput } from '../../../../components/DateInput/DateInput';
import { TimeInput } from '../../../../components/TimeInput/TimeInput';

export const RegisterEventForm = () => {
  const [state, formAction, isPending] = useActionState(registerEventAction, {
    message: '',
    success: false,
  });

  return (
    <main className={styles.main}>
      <form action={formAction} className={styles.form}>
        <TextInput name="imageURL" type="text" label="URL imagem" />

        <TextInput name="title" type="text" label="Título" required />

        <TextArea name="description" label="Descrição" required rows={4} /> 
        <div className={styles.row}> 
          <TextInput name="maxSlots" type="text" label="Máximo vagas" required />
          <TextInput name="place" type="text" label="Local" required />
        </div>
        
        <div>
          <DateInput name="startDate" label="Data início" required />
          <br></br>
          <DateInput name="endDate" label="Data término" required />
          <br></br>
          <TimeInput name="startTime" label="Horário início" required />
        </div>

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
    </main>
  );
};
