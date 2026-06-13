import { useEffect, useRef } from 'react';
import wc from 'wordcloud';
import styles from './WordCloudChart.module.css';

interface WordCloudProps {
  data: [string, number][];
}

export const WordCloudChart = ({ data }: WordCloudProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const maxWeight = data[0][1];
    const targetMaxFontSize = 95;
    const dynamicWeightFactor = targetMaxFontSize / maxWeight;

    wc(canvasRef.current, {
      list: data,
      fontWeight: 'bold',
      weightFactor: dynamicWeightFactor,
      drawOutOfBound: false, 
    });

    return () => {
      // stop the renderring
      wc.stop();
    };
  }, [data]);

  return (
    <canvas
      style={{}}
      className={styles.myCanvas}
      ref={canvasRef}
      width={1280}
      height={720}
    />
  );
};
