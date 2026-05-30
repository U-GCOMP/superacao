import styles from './BioComponent.module.css';
import { useState } from 'react';
import { Button } from '../../../../components/Button/Button';
import { patchUserBioAction } from '../../api/patch-user-bio-action';

interface BioComponentProps {
    bio: string;
    isOwner: boolean;
    userId: number | null;
    onBioUpdated: (bio: string) => void;
    onError?: (message: string) => void;
}

export const BioComponent = ({
    bio,
    isOwner,
    userId,
    onBioUpdated,
    onError,
}: BioComponentProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftBio, setDraftBio] = useState(bio);

    if (!isOwner && !bio) {
        return null;
    }

    const hasBio = bio.trim().length > 0;
    const actionLabel = hasBio ? 'Editar bio' : 'Adicionar bio';

    const handleSave = async () => {
        if (!userId) {
            return;
        }

        try {
            const response = await patchUserBioAction(draftBio, userId);
            onBioUpdated(response.bio);
            setIsEditing(false);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Erro ao atualizar bio';

            onError?.(message);
        }
    };

    return (
        <div className={styles.bioContainer}>
            <h3>Bio:</h3>

            {!isEditing ? (
                <>
                    {hasBio ? (
                        <p>{bio}</p>
                    ) : (
                        <p className={styles.emptyBioMessage}>Você ainda não adicionou uma bio.</p>
                    )}

                    {isOwner && (
                        <Button
                            text={actionLabel}
                            buttonStyle="terciary"
                            compact
                            className={styles.editButton}
                            onClick={() => {
                                setDraftBio(bio);
                                setIsEditing(true);
                            }}
                        />
                    )}
                </>
            ) : (
                <div className={styles.editor}>
                    <label className={styles.editorLabel}>
                        <textarea
                            className={styles.textarea}
                            value={draftBio}
                            onChange={(event) => setDraftBio(event.target.value)}
                            rows={5}
                            placeholder="Escreva algo sobre você"
                        />
                    </label>

                    <div className={styles.actions}>
                        <Button
                            className={styles.cancelButton}
                            text="Cancelar"
                            buttonStyle="terciary"
                            compact
                            onClick={() => {
                                setDraftBio(bio);
                                setIsEditing(false);
                            }}
                        />
                        <Button
                            className={styles.saveButton}
                            text="Salvar"
                            compact
                            onClick={handleSave}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};