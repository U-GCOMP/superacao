import { useState } from 'react';
import { Button } from '../../../../components/Button/Button';
import { TextInput } from '../../../../components/TextInput/TextInput';
import { patchUserUsernameAction } from '../../api/patch-user-username-action';
import { Check, PencilLine, X } from 'lucide-react';
import styles from './UsernameComponent.module.css';

interface UsernameComponentProps {
    username: string;
    isOwner: boolean;
    userId: number | null;
    onUsernameUpdated: (username: string) => void;
    onError?: (message: string) => void;
}

export const UsernameComponent = ({
    username,
    isOwner,
    userId,
    onUsernameUpdated,
    onError,
}: UsernameComponentProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftUsername, setDraftUsername] = useState(username);

    const handleSave = async () => {
        if (!userId) {
            return;
        }

        try {
            const response = await patchUserUsernameAction(draftUsername.trim(), userId);
            onUsernameUpdated(response.username);
            setIsEditing(false);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Erro ao atualizar username';

            onError?.(message);
        }
    };

    if (!isOwner) {
        return <h2 className={styles.usernameTitle}>{username}</h2>;
    }

    return (
        <div className={styles.usernameContainer}>
            {!isEditing ? (
                <div className={styles.displayRow}>
                    <h2 className={styles.usernameTitle}>{username}</h2>
                    <Button
                        buttonStyle='tertiary-icon'
                        className={styles.editIconButton}
                        onClick={() => {
                            setDraftUsername(username);
                            setIsEditing(true);
                        }}
                        ariaLabel="Editar nome de usuário"
                    >
                        <PencilLine width={16} height={16} className={styles.editIcon} />
                    </Button>
                </div>
            ) : (
                <form action={handleSave} className={styles.editor}>
                    <TextInput
                        name="username"
                        label="Nome de usuário"
                        value={draftUsername}
                        onChange={setDraftUsername}
                        required
                        className={styles.usernameInput}
                    />

                    <div className={styles.actions}>
                        <Button
                            className={styles.cancelButton}
                            buttonStyle="tertiary-icon"
                            onClick={() => {
                                setDraftUsername(username);
                                setIsEditing(false);
                            }}
                        >
                            <X width={24} height={24} />
                        </Button>
                        <Button
                            className={styles.saveButton}
                            buttonStyle="tertiary-icon"
                            type='submit'
                            disabled={!draftUsername.trim()}
                        >
                            <Check width={24} height={24} />
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};