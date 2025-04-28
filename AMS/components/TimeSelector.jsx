import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';

const TimeSelector = ({ label, time, onTimeChange }) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const showPicker = () => setIsPickerVisible(true);

  const handleChange = (event, selectedTime) => {
    setIsPickerVisible(false);
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      onTimeChange(formattedTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.inputContainer} onPress={showPicker}>
        <Text style={[styles.inputText, !time && styles.placeholder]}>
          {time || 'Select Time'}
        </Text>
        <FontAwesome name="clock-o" size={20} color="#555" />
      </TouchableOpacity>

      {isPickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0D3F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    color: '#999',
  },
});

export default TimeSelector;
