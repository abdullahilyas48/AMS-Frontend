import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';  // Correct FontAwesome import
import { Calendar } from 'react-native-calendars';  // Make sure this package is installed

const DateSelector = ({ label, date, onDateChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to handle the date selection
  const handleDatePress = (day) => {
    onDateChange(new Date(day.dateString));  // Use null in initial state when no date is selected
    setIsModalVisible(false);  // Close modal after selecting a date
  };

  return (
    <View style={styles.container}>
      {/* Label for the Date Selector */}
      <Text style={styles.label}>{label}</Text>

      {/* Touchable to show modal */}
      <TouchableOpacity style={styles.inputContainer} onPress={() => setIsModalVisible(true)}>
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
    <Text style={[styles.inputText, !date && styles.placeholderText]}>
      {date ? new Date(date).toDateString() : 'Select Date'}
    </Text>
    <FontAwesome name="calendar" size={20} color="#555" />
  </View>
</TouchableOpacity>


      {/* Modal to display the calendar when isModalVisible is true */}
      {isModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.calendarContainer}>
            <Calendar
  onDayPress={handleDatePress}
  markedDates={
    date
      ? { [date.toISOString().split('T')[0]]: { selected: true, selectedColor: 'blue' } }
      : {}
  }
  markingType={'simple'}
/>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}  // Close the modal
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Styles for the components
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
    backgroundColor: '#E0D3F5',  // Input field background color
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,  // Input field height
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 16,  // Consistent font size
    color: '#000', // Text color
  },
  placeholderText: {
    color: '#888',  // Faded gray for placeholder text
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Background color of modal (transparent dark)
  },
  calendarContainer: {
    backgroundColor: 'white',  // White background for the calendar
    padding: 20,
    borderRadius: 8,
    width: 300,  // Calendar width
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2196F3',  // Blue background for the close button
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',  // White text color for close button
    textAlign: 'center',  // Center text
  },
});

export default DateSelector;
