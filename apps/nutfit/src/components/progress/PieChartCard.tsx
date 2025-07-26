import React from 'react';
import { Dimensions, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Card from '../Card';

interface Slice {
  name: string;
  value: number;
  color: string;
}

interface Props {
  title: string;
  slices: Slice[];
}

export default function PieChartCard({ title, slices }: Props) {
  const width = Dimensions.get('window').width - 32;
  return (
    <Card>
      <Text style={{ color: '#fff', marginBottom: 8 }}>{title}</Text>
      <PieChart
        data={slices.map(s => ({
          name: s.name,
          population: s.value,
          color: s.color,
          legendFontColor: '#fff',
          legendFontSize: 12,
        }))}
        width={width}
        height={220}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </Card>
  );
}
