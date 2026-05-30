import { useState } from 'react';
import { Button } from '../../../../components/Button/Button';
import { TextPopUp } from '../../../../components/TextPopUp/TextPopUp';
import { AppError } from '../../../../lib/http-client';
import { deactivateAccountAction } from '../../api/deactivate-account-action';
import styles from './DeactivateAccountButton.module.css';

interface DeactivateAccountButtonProps {
    isOwnProfile: boolean;
    onSuccess: () => void;
    onError?: (message: string) => void;
}

export const DeactivateAccountButton = ({
    isOwnProfile,
    onSuccess,
    onError,
}: DeactivateAccountButtonProps) => {
    const [isDeactivatePopUpOpen, setIsDeactivatePopUpOpen] = useState(false);

    if (!isOwnProfile) {
        return null;
    }

    const deactivateAccount = async () => {
        try {
            setIsDeactivatePopUpOpen(false);
            await deactivateAccountAction();

            alert('Conta desativada com sucesso!\nVocê será redirecionado para a página de login.');
            onSuccess();
        } catch (error) {
            const message = error instanceof AppError || error instanceof Error
                ? error.message
                : 'Erro ao desativar conta';

            onError?.(message);
        }
    };

    return (
        <>
            {isDeactivatePopUpOpen && (
                <TextPopUp
                    isOpen={isDeactivatePopUpOpen}
                    onClose={() => setIsDeactivatePopUpOpen(false)}
                    onConfirm={deactivateAccount}
                    confirmText='Desativar'
                    title='Você tem certeza que quer desativar sua conta?'
                    description='Essa ação é irreversível, você perderá o acesso a seus dados, eventos e sua conta não será mais visível para outros usuários.'
                />
            )}
            <div className={styles.buttonWrapper}>
                <Button
                    text='Desativar conta'
                    buttonStyle='terciary'
                    compact
                    onClick={() => setIsDeactivatePopUpOpen(true)}
                />
            </div>
        </>
    );
};