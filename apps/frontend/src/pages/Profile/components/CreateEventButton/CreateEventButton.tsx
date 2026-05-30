import { Button } from '../../../../components/Button/Button';
import styles from './CreateEventButton.module.css';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../../router/routes'

interface CreateEventButtonProps {
    isOwnProfile: boolean;
}

export const CreateEventButton = ({
    isOwnProfile,
}: CreateEventButtonProps) => {

    const navigate = useNavigate();

    if (!isOwnProfile) {
        return null;
    }

    const handleCreateEvent = () => {
        navigate(AppRoutes.REGISTER_EVENT);
    };

    return (
        <div className={styles.buttonWrapper}>
            <Button
                text='Criar evento'
                buttonStyle='secondary'
                compact
                onClick={handleCreateEvent}
            />
        </div>
    );
};