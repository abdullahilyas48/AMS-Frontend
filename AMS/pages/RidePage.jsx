import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons
import DateSelector from '../components/DateSelector'; 
import TimeSelector from '../components/TimeSelector'; 
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';
import PriceRangeSelector from '../components/PriceRangeSelector';

const BookRentalService = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  
  const userId = '6635f9b7e7c6e62cd7e02ab0'; // <-- Replace this with the REAL logged-in userId

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`http://192.168.1.113:7798/vehicles?maxPrice=${priceRange[1]}&minPrice=${priceRange[0]}`);
      setVehicleOptions(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      Alert.alert('Error', 'Unable to fetch available vehicles.');
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [priceRange]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !destination || !vehicleId) {
      alert('Please fill all the fields before submitting!');
      return;
    }

    const bookingData = {
      userId,
      vehicleId,
      date: selectedDate,
      time: selectedTime,
      destination,
    };

    try {
      const response = await axios.post('http://192.168.100.18:7798/book-vehicles', bookingData);
      alert('Booking successful!\n' + JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Booking failed:', error.response ? error.response.data : error.message);
      Alert.alert('Booking Failed', 'Please try again later.');
    }
  };

  const selectVehicle = (vehicle) => {
    setVehicleId(vehicle._id);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Rental Service</Text>

      <DateSelector
        label="Select Date"
        date={selectedDate}
        onDateChange={setSelectedDate}
      />

      <TimeSelector
        label="Select Time"
        time={selectedTime}
        onTimeChange={setSelectedTime}
      />

      {/* Destination Input Field */}
      <InputField
        placeholder="Enter Destination"
        iconName="ios-location"
        value={destination}
        onChangeText={setDestination}
        iconFamily="Ionicons"
      />

      <PriceRangeSelector
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {/* Vehicle Selection */}
      <Text style={styles.inputHeading}>Choose your Vehicle</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputField}>
        <Text style={styles.inputText}>
          {vehicleId ? vehicleOptions.find(v => v._id === vehicleId)?.name : 'Select Vehicle'}
        </Text>
        <Ionicons name="car" size={20} color="#888" />
      </TouchableOpacity>

      {/* Modal for Vehicle Options */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={vehicleOptions}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectVehicle(item)} style={styles.modalItem}>
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

export default BookRentalService;
