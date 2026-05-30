import { ChangeEvent, useRef } from 'react';
import styles from './AvatarComponent.module.css';
import { patchProfilePictureAction } from '../../api/patch-profile-picture-action';

interface AvatarComponentProps {
    imageUrl: string;
    isOwnProfile: boolean;
    userId?: number | null;
    onImageUpdated: (imageURL: string) => void;
    onError?: (message: string) => void;
}

export const AvatarComponent = ({
    imageUrl,
    isOwnProfile,
    onImageUpdated,
    onError,
}: AvatarComponentProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openProfileImagePicker = () => {
        if (!isOwnProfile) {
            return;
        }

        fileInputRef.current?.click();
    };

    const handleProfilePictureChange = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const result = await patchProfilePictureAction(formData);

            if (result.success && result.data) {
                onImageUpdated(result.data.imageUrl); 
            } else {
                onError?.(result.message);
            }
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Erro ao atualizar foto de perfil';

            onError?.(message);
        } finally {
            event.target.value = '';
        }
    };

    return (
        <div className={styles.avatarContainer}>
            <button
                type="button"
                className={styles.avatarButton}
                onClick={openProfileImagePicker}
                aria-label="Editar foto de usuário"
            >
                <img src={imageUrl} role='presentation' alt="" className={styles.avatarImage} />
                {isOwnProfile && (
                    <span className={styles.avatarOverlay}>Editar foto de usuário</span>
                )}
            </button>
            {isOwnProfile && (
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.hiddenFileInput}
                    onChange={handleProfilePictureChange}
                />
            )}
        </div>
    );
};