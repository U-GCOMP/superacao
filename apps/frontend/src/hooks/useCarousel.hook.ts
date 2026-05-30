import { useRef, useState, useEffect } from "react";

export const useCarousel = (list: unknown[]) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        const carouselElement = carouselRef.current;

        if (!carouselElement) {
            return;
        }

        const updateScrollButtons = () => {
            const hasHorizontalOverflow = carouselElement.scrollWidth > carouselElement.clientWidth;
            const isAtStart = carouselElement.scrollLeft <= 0;
            const isAtEnd = carouselElement.scrollLeft + carouselElement.clientWidth >= carouselElement.scrollWidth;

            setCanScrollLeft(hasHorizontalOverflow && !isAtStart);
            setCanScrollRight(hasHorizontalOverflow && !isAtEnd);
        };

        updateScrollButtons();

        carouselElement.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);

        return () => {
            carouselElement.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [list]);

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (!carouselRef.current) {
            return;
        }

        const scrollAmount = carouselRef.current.offsetWidth;
        
        if (direction === 'left') {
            carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            return;
        }

        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return {
        carouselRef,
        canScrollLeft,
        canScrollRight,
        scrollCarousel,
    };
}