import styles from "./Pill.module.css"

interface PillProps {
    text: string;
    pillStyle?: 'primary' | 'secondary';
}

export const Pill = ({
    text,
    pillStyle = 'primary',
}: PillProps) => {
    return (
        <div
            className={`${styles.pill} ${styles[pillStyle]}`}
        >
            {text}
        </div>
    )
}
