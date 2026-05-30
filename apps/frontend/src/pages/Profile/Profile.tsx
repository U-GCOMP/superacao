import { useEffect, useState } from 'react';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';
import styles from './Profile.module.css';
import { FetchUserProfileResponseDTO } from '@project/shared';
import { fetchUserDetailsAction as fetchUserProfileAction } from './api/fetch-user-profile-action';
import { Button } from '../../components/Button/Button';
import { useAuthentication } from '../../hooks/useAuthentication.hook';
import { RatingStars } from '../../components/RatingStars/RatingStars';
import { StatsDisplay } from './components/StatsDisplay/StatsDisplay';
import { EventCarousel } from '../../features/event/ui/components/EventCarousel/EventCarousel';
import { TextPopUp } from '../../components/TextPopUp/TextPopUp';
import { deactivateAccountAction } from './api/deactivate-account-action';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../router/routes';
import { AppError, HttpClient } from '../../lib/http-client';

export const Profile = () => {
    const navigate = useNavigate();
    const { id } = useAuthentication();
    
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<FetchUserProfileResponseDTO | null>(null);

    const [isDeactivatePopUpOpen, setIsDeactivatePopUpOpen] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                const result = await fetchUserProfileAction({id: id!});
                setProfileData(result);
            } catch (error) {
                if (error instanceof AppError) {
                    if (error.statusCode === 404) {
                        HttpClient.clearAuthSession();
                        
                    } else {
                        setErrorMessage(error.message);
                    }
                }
                setErrorMessage((error as Error).message || 'Erro ao carregar perfil');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    const deactivateAccount = async () => {
        try {
            setIsDeactivatePopUpOpen(false);
            setIsLoading(true);
            
            await deactivateAccountAction();
            
            alert("Conta desativada com sucesso!\nVocê será redirecionado para a página de login.");
            navigate(AppRoutes.LOGIN);
        } catch (error) {
            if (error instanceof Error || error instanceof AppError) {
                alert(error.message);
                return;
            }
            alert('Erro ao desativar conta');
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <BaseScreen>
                <div className={styles.loading}>Carregando...</div>
            </BaseScreen>
        );
    }

    if (!profileData) {
        return (
            <BaseScreen>
                <div className={styles.error}>{errorMessage}</div>
            </BaseScreen>
        );
    }
    
    return (
        <>
            {
                isDeactivatePopUpOpen && (
                    <TextPopUp
                        isOpen={isDeactivatePopUpOpen}
                        onClose={() => setIsDeactivatePopUpOpen(false)}
                        onConfirm={deactivateAccount}
                        confirmText='Desativar'
                        title='Você tem certeza que quer desativar sua conta?'
                        description='Essa ação é irreversível, você perderá o acesso a seus dados, eventos e sua conta não será mais visível para outros usuários.'
                    />
                )
            }
            <BaseScreen hasPadding={false}>
                <section className={styles.section}>
                    <div className={styles.orangeBanner}></div>
                    <div className={styles.headerDivider}></div>
                    <div className={styles.header}>
                        <div className={styles.leftContent}>
                            <h2>{profileData.username}</h2>
                            {
                                id === profileData.id && (
                                    <Button text='Desativar conta' buttonStyle='terciary' compact onClick={() => setIsDeactivatePopUpOpen(true)} />
                                )
                            }
                        </div>
                        <div className={styles.rightContent}>
                            <div className={styles.avatarContainer}>
                                <img src={profileData.imageUrl} role='presentation' alt="" />
                            </div>
                            <RatingStars rating={profileData.rating} />
                        </div>
                    </div>
                    <div className={styles.content}>
                        <StatsDisplay label='Eventos participados' value={profileData.events_participated_count.toString()} />
                        <StatsDisplay label='Eventos organizados' value={profileData.events_organized_count.toString()} />
                        <StatsDisplay label='Nota' labelSpan={` (${profileData.number_ratings} avaliações)`} value={profileData.rating.toString()} valueSpan='/5' />
                        <div className={styles.bioContainer}>
                            <h3>Bio:</h3>
                            <p>{profileData.bio}</p>
                        </div>
                    </div>
                </section>
                <section className={`${styles.section} ${styles.eventSection}`}>
                    <h2>Eventos participados</h2>
                    <EventCarousel events={profileData.events_participated} />
                    {
                        profileData.events_participated.length === 0 && (
                            <p className={styles.noEventsMessage}>Nenhum evento participado ainda.</p>
                        )
                    }
                </section>
                <section className={`${styles.section} ${styles.eventSection}`}>
                    <h2>Eventos organizados</h2>
                    <EventCarousel events={profileData.events_organized} />
                    {
                        profileData.events_organized.length === 0 && (
                            <p className={styles.noEventsMessage}>Nenhum evento organizado ainda.</p>
                        )
                    }
                </section>
            </BaseScreen>
        </>
    )
}