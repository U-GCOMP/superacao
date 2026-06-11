import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';

interface RatingHistogramProps {
    ratingData: number[];
    ratingLabels: string[];
}

export const RatingHistogram = ({ ratingData, ratingLabels }: RatingHistogramProps) => {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <BarChart
        series={[
          { data: ratingData, label: 'Stars', id: 'startId', color: '#fdb462' },
        ]}
        xAxis={[{ data: ratingLabels, height: 28 }]}
        yAxis={[{ width: 50 }]}
      />
    </Box>
  );
}
