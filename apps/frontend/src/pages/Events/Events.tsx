import styles from "./Events.module.css"
import { BaseScreen } from "../../components/BaseScreen/BaseScreen"
import { EventList } from "../../features/event/ui/EventList/EventList"

export const Events = () => {
    return (
        <BaseScreen>
            <div className={styles.container}>
                <h2 className={styles.header}>Engaje-se em uma vaga!</h2>
                <EventList />
            </div>
        </BaseScreen>
    )
}