import { Link } from "react-router-dom";
import styles from "./EventCardComponent.module.css";
import { FetchEventListItemResponseDTO } from "@project/shared";

export const EventCardComponent = ({eventId, imageUrl, title, description, volunteersCount, maxVolunteers, status, date}: FetchEventListItemResponseDTO) => {
    const getStatusText = () => {
        type StatusOptions = typeof status;
        
        const statusTextMap: Record<StatusOptions, string> = {
            SCHEDULED: "Em organização",
            COMPLETED: "Concluído",
            CANCELED: "Cancelado",
        };
        
        return statusTextMap[status] || "";
    };

    return (
        <div className={styles.card}>
            <img src={imageUrl} alt="" role="presentation" />
            <div className={styles.textContainer}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description} >{description}</p>
                <p className={styles.info}>
                    <span>Vagas preenchidas:</span> {volunteersCount}/{maxVolunteers} voluntários
                </p>
                <p className={styles.info}>
                    <span>Status:</span> {getStatusText()}
                </p>
                <p className={styles.info}>
                    <span>Data:</span> {date.toLocaleDateString()}
                </p>
            </div>
            <Link to={`/eventos/${eventId}`}>Ver mais</Link>
        </div>
    )
}