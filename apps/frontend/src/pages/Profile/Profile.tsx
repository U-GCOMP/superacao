import { useEffect, useState } from 'react';
import { BaseScreen } from '../../components/BaseScreen/BaseScreen';
import styles from './Profile.module.css';
import { FetchUserProfileResponseDTO } from '@project/shared';
import { fetchUserDetailsAction as fetchUserProfileAction } from './api/fetch-user-profile-action';
import { useAuthentication } from '../../hooks/useAuthentication.hook';
import { RatingStars } from '../../components/RatingStars/RatingStars';
import { StatsDisplay } from './components/StatsDisplay/StatsDisplay';
import { EventCarousel } from '../../features/event/ui/components/EventCarousel/EventCarousel';
import { useNavigate, useParams } from 'react-router-dom';
import { AppRoutes } from '../../router/routes';
import { AppError, HttpClient } from '../../lib/http-client';
import { AvatarComponent } from './components/AvatarComponent/AvatarComponent';
import { DeactivateAccountButton } from './components/DeactivateAccountButton/DeactivateAccountButton';
import { BioComponent } from './components/BioComponent/BioComponent';
import { UsernameComponent } from './components/UsernameComponent/UsernameComponent';

export const Profile = () => {
    const navigate = useNavigate();
    const { id: loggedUserId } = useAuthentication();
    const id  = useParams().id ?? loggedUserId;

    const isOwnProfile = id === loggedUserId;
    
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<FetchUserProfileResponseDTO | null>(null);

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

    const onAvatarUpdated = (imageURL: string) => {
        setProfileData((currentProfile) => {
            if (!currentProfile) {
                return currentProfile;
            }

            return {
                ...currentProfile,
                imageUrl: imageURL,
            };
        });
    }

    const onBioUpdated = (bio: string) => {
        setProfileData((currentProfile) => {
            if (!currentProfile) {
                return currentProfile;
            }

            return {
                ...currentProfile,
                bio,
            };
        });
    };

    const onUsernameUpdated = (username: string) => {
        setProfileData((currentProfile) => {
            if (!currentProfile) {
                return currentProfile;
            }

            return {
                ...currentProfile,
                username,
            };
        });
    };

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
        <BaseScreen hasPadding={false}>
                <section className={styles.section}>
                    <div className={styles.orangeBanner}></div>
                    <div className={styles.headerDivider}></div>
                    <div className={styles.header}>
                        <div className={styles.leftContent}>
                            <UsernameComponent
                                username={profileData.username}
                                isOwner={isOwnProfile}
                                userId={loggedUserId ? Number(loggedUserId) : null}
                                onUsernameUpdated={onUsernameUpdated}
                                onError={(message) => setErrorMessage(message)}
                            />
                            <DeactivateAccountButton
                                isOwnProfile={isOwnProfile}
                                onSuccess={() => navigate(AppRoutes.LOGIN)}
                                onError={(message) => setErrorMessage(message)}
                            />
                        </div>
                        <div className={styles.rightContent}>
                            <AvatarComponent
                                imageUrl={profileData.imageUrl ? (profileData.imageUrl.startsWith('http://') || profileData.imageUrl.startsWith('https://') ? profileData.imageUrl : `http://localhost:3000/users/image/${profileData.imageUrl}`) : ''}
                                isOwnProfile={isOwnProfile}
                                userId={loggedUserId ? Number(loggedUserId) : null}
                                onImageUpdated={onAvatarUpdated}
                                onError={(message) => setErrorMessage(message)}
                            />
                            <RatingStars rating={profileData.rating} />
                        </div>
                    </div>
                    <div className={styles.content}>
                        <StatsDisplay label='Eventos participados' value={profileData.events_participated_count.toString()} />
                        <StatsDisplay label='Eventos organizados' value={profileData.events_organized_count.toString()} />
                        <StatsDisplay label='Nota' labelSpan={` (${profileData.number_ratings} avaliações)`} value={profileData.rating.toString()} valueSpan='/5' />
                        <BioComponent
                            bio={profileData.bio}
                            isOwner={isOwnProfile}
                            userId={loggedUserId ? Number(loggedUserId) : null}
                            onBioUpdated={onBioUpdated}
                            onError={(message) => setErrorMessage(message)}
                        />
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
    )
}