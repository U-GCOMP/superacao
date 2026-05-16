import { RegisterEventForm } from '../../features/event/ui/RegisterEventForm/RegisterEventForm';
import styles from './RegisterEvent.module.css';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';
import { TextPopUp } from '../../components/TextPopUp/TextPopUp';
import { useState } from 'react';
import { Button } from '../../components/Button/Button';

export const RegisterEvent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmAction = () => {
    console.log("Ação confirmada! Executando lógica...");
    setIsModalOpen(false); // Fecha o modal após confirmar
  };

  return (
    <BaseScreen>
      <main className={styles.content}>
        <RegisterEventForm />
        <Button 
          buttonStyle="terciary" 
          text="Desativar conta"  
          onClick={() => setIsModalOpen(true)}
        />

        <TextPopUp 
          key={isModalOpen ? 'aberto' : 'fechado'}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmAction}
          title="Desativar conta de usuário"
          description="Ao confirmar, suas informações de perfil e avaliações serão ocultadas permanentemente."
          confirmText="Desativar"
          labelConfirm="Confirmar"
          labelCancel="Voltar"
        />
      </main>
    </BaseScreen>
  );
};