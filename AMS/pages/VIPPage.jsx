import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateSelector from '../components/DateSelector';
import TimeSelector from '../components/TimeSelector'; // Create TimeSelector for time input
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';

const BookLounge = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loungeName, setLoungeName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loungeOptions, setLoungeOptions] = useState([]);
  const [loungeId, setLoungeId] = useState(null);

  const userId = '6635f9b7e7c6e62cd7e02ab0'; // <-- Replace with the REAL logged-in userId

  // Fetch available lounges
  const fetchLounges = async () => {
    try {
      const response = await axios.get('http://192.168.100.18:7798/lounges');
      setLoungeOptions(response.data);
    } catch (error) {
      console.error('Error fetching lounges:', error);
      Alert.alert('Error', 'Unable to fetch available lounges.');
    }
  };

  useEffect(() => {
    fetchLounges();
  }, []);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !loungeId) {
      alert('Please fill all the fields before submitting!');
      return;
    }

    const bookingData = {
      userId,
      loungeId,
      date: selectedDate,
      time: selectedTime,
    };

    try {
      const response = await axios.post('http://192.168.100.18:7798/book-lounge', bookingData);
      alert('Lounge booked successfully!\n' + JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Booking failed:', error.response ? error.response.data : error.message);
      Alert.alert('Booking Failed', 'Please try again later.');
    }
  };

  const selectLounge = (lounge) => {
    setLoungeName(lounge.name);
    setLoungeId(lounge._id);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Book a Lounge</Text>

      <DateSelector
        label="Select Date"
        date={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Time Selection */}
      <TimeSelector
        label="Select Time"
        time={selectedTime}
        onTimeChange={setSelectedTime}
      />

      {/* Lounge Selection */}
      <Text style={styles.inputHeading}>Choose your Lounge</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputField}>
        <Text style={styles.inputText}>
          {loungeName ? loungeName : 'Select Lounge'}
        </Text>
        <Ionicons name="restaurant" size={20} color="#888" />
      </TouchableOpacity>

      {/* Modal for Lounge Options */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={loungeOptions}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectLounge(item)} style={styles.modalItem}>
                  <Text style={styles.modalText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <PrimaryButton label="Book Now" onPress={handleBooking} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8BFE8',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  inputHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    marginTop: 15,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E9D5FF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1c1e0',
    marginBottom: 20,
  },
  inputText: {
    fontSize: 16,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#D8BFE8',
    width: 300,
    borderRadius: 5,
    paddingVertical: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalText: {
    fontSize: 18,
    color: '#000',
  },
});

export default BookLounge;
