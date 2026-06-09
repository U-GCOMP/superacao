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

    wc(canvasRef.current, {
      list: data,
      minSize: 10,
      fontWeight: 'bold',
      weightFactor: 1.5,
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
