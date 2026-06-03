import { Link, generatePath } from "react-router-dom";
import styles from "./EventCardComponent.module.css";
import { FetchEventListItemResponseDTO } from "@project/shared";
import { DateFormatter } from "../../../../../utils/date-formater";
import { AppRoutes } from "../../../../../router/routes";

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
            <img className={styles.image} src={imageUrl} alt="" role="presentation" />
            <div className={styles.content}>
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
                        <span>Data:</span> {DateFormatter.formatToBrazilianDate(date)}
                    </p>
                </div>
                <Link to={generatePath(AppRoutes.DETAIL_EVENT, { id: eventId })}>Ver mais</Link>
            </div>
        </div>
    )
}