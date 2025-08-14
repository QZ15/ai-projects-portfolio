import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import Card from '../ui/Card';
import { useProgress } from '../../context/ProgressContext';

export default function WeightInputCard() {
  const [weight, setWeight] = useState('');
  const { addWeight } = useProgress();

  const handleSubmit = () => {
    const parsed = parseFloat(weight);
    if (isNaN(parsed)) return Alert.alert('Invalid weight');
    addWeight(parsed);
    Alert.alert('Weight saved!');
    setWeight('');
  };

  return (
    <Card>
      <Text style={{ color: '#fff', marginBottom: 8 }}>Enter Today’s Weight</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="lbs"
          placeholderTextColor="#999"
          style={{
            flex: 1,
            backgroundColor: '#222',
            padding: 10,
            borderRadius: 8,
            color: '#fff',
          }}
        />
        <Button title="Save" onPress={handleSubmit} />
      </View>
    </Card>
  );
}
