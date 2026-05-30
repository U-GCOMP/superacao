import styles from './StatsDisplay.module.css';

interface StatsDisplayProps {
    value: string;
    valueSpan?: string;
    label: string;
    labelSpan?: string;
}

export const StatsDisplay = ({ value, valueSpan, label, labelSpan }: StatsDisplayProps) => {
    return (
        <div className={styles.container}>
            <span className={styles.value}>{value}<span className={styles.valueSpan}>{valueSpan}</span></span>
            <div className={styles.divider} />
            <span className={styles.label}>{label}<span className={styles.labelSpan}>{labelSpan}</span></span>
        </div>
    )
}