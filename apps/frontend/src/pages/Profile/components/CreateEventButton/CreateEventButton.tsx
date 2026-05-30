import { Button } from '../../../../components/Button/Button';
import styles from './CreateEventButton.module.css';
import { useNavigate } from 'react-router-dom';

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
        navigate('/cadastrar-evento');
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