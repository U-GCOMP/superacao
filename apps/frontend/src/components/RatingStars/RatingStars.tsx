import styles from "./RatingStars.module.css";

export const RatingStars = ({ rating }: { rating: number }) => {
    const MAX_RATING = 5;
    const filledStars = Math.floor(rating);
    const partialStarPercentage = (rating - filledStars) * 100;
    const emptyStars = MAX_RATING - filledStars - (partialStarPercentage > 0 ? 1 : 0);

    return (
        <div className={styles.starsContainer}>
            {[...Array(filledStars)].map((_, index) => (
                <span key={`filled-${index}`} className={styles.star} data-fill-type="filled" />
            ))}
            {partialStarPercentage > 0 && (
                <span
                    key="partial"
                    style={{ '--fill-percentage': `${partialStarPercentage}%` } as React.CSSProperties}
                    className={styles.star}
                    data-fill-type="partial"
                />
            )}
            {[...Array(emptyStars)].map((_, index) => (
                <span key={`empty-${index}`} className={styles.star} data-fill-type="empty" />
            ))}
        </div>
    )
}