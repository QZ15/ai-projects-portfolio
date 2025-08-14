import { View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useProgress } from '../../context/ProgressContext';
import { Dimensions } from 'react-native';

export default function WeightChart() {
  const { weightData } = useProgress();
  const screenWidth = Dimensions.get('window').width;

  const sorted = [...weightData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const labels = sorted.map(e => e.date.slice(5)); // MM-DD
  const data = sorted.map(e => e.weight);

  return (
    <View className="mt-6">
      <LineChart
        data={{
          labels,
          datasets: [{ data }]
        }}
        width={screenWidth - 40}
        height={220}
        yAxisSuffix="kg"
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#000',
          backgroundGradientTo: '#000',
          decimalPlaces: 1,
          color: () => '#22d3ee',
          labelColor: () => '#aaa',
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}
