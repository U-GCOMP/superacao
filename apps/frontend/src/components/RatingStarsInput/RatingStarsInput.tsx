import { useState, MouseEvent } from "react";
import styles from "./RatingStarsInput.module.css";

interface RatingStarsInputProps {
  value: number;                      
  onChange: (rating: number) => void; 
  name?: string;                      
}

export const RatingStarsInput = ({ value, onChange, name }: RatingStarsInputProps) => {
  const MAX_RATING = 5;
  const MIN_RATING = 1; 
  
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue !== null ? hoverValue : value;

  const calculateValue = (e: MouseEvent<HTMLButtonElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const isLeftHalf = x < rect.width / 2;
    
    const calculated = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
    
    return Math.max(calculated, MIN_RATING);
  };

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    const newValue = calculateValue(e, index);
    setHoverValue(newValue);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    const newValue = calculateValue(e, index);
    onChange(newValue);
  };

  return (
    <div 
      className={styles.starsContainer}
      onMouseLeave={() => setHoverValue(null)} 
    >
      {name && <input type="hidden" name={name} value={value} />}

      {Array.from({ length: MAX_RATING }).map((_, index) => {
        const starNumber = index + 1;
        
        let fillType: "filled" | "partial" | "empty" = "empty";
        let partialPercentage = 0;

        if (displayValue >= starNumber) {
          fillType = "filled";
        } else if (displayValue > index && displayValue < starNumber) {
          fillType = "partial";
          partialPercentage = (displayValue - index) * 100;
        }

        return (
          <button
            key={starNumber}
            type="button" 
            className={styles.starButton}
            data-fill-type={fillType}
            style={
              fillType === "partial" 
                ? ({ "--fill-percentage": `${partialPercentage}%` } as React.CSSProperties) 
                : undefined
            }
            onClick={(e) => handleClick(e, index)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            aria-label={`Avaliar com ${starNumber} estrelas`}
          />
        );
      })}
    </div>
  );
};