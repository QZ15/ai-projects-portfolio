import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Card from '../Card';
import { Text } from 'react-native';

interface Props {
  title: string;
  labels: string[];
  datasets: { data: number[] }[];
}

export default function LineChartCard({ title, labels, datasets }: Props) {
  const width = Dimensions.get('window').width - 32;
  return (
    <Card>
      <Text style={{ color: '#fff', marginBottom: 8 }}>{title}</Text>
      <LineChart
        data={{ labels, datasets }}
        width={width}
        height={220}
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#000',
          backgroundGradientTo: '#000',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
        }}
        style={{ borderRadius: 8 }}
      />
    </Card>
  );
}
