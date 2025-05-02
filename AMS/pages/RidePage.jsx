import React, { useState, useEffect } from 'react';   
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native'; 
import { FontAwesome } from '@expo/vector-icons'; 
import DateSelector from '../components/DateSelector'; 
import TimeSelector from '../components/TimeSelector'; 
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';
import PriceRangeSelector from '../components/PriceRangeSelector';
import useAuth from '../hooks/useAuth';
import { TouchableWithoutFeedback } from 'react-native';

const BookRentalService = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const { userData, isLoading } = useAuth(); 
  const userId = userData?._id;

  useEffect(() => {
    if (userData && userData._id) {
      fetchVehicles();
    }
  }, [userData]);

  useEffect(() => {
    fetchVehicles();
  }, [priceRange]);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`http://192.168.100.18:7798/vehicles?maxPrice=${priceRange[1]}&minPrice=${priceRange[0]}`);
      setVehicleOptions(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      Alert.alert('Error', 'Unable to fetch available vehicles.');
    }
  };

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
      alert('Booking successful!');
    } catch (error) {
      console.error('Booking failed:', error.response ? error.response.data : error.message);
      Alert.alert('Booking Failed', 'Please try again later.');
    }
  };

  const selectVehicle = (vehicle) => {
    setVehicleId(vehicle._id);
    setModalVisible(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Book a Rental Service</Text>

        <DateSelector label="Select Date" date={selectedDate} onDateChange={setSelectedDate} />
        <TimeSelector label="Select Time" time={selectedTime} onTimeChange={setSelectedTime} />

        <InputField
          placeholder="Enter Destination"
          iconName="location-arrow"
          value={destination}
          onChangeText={setDestination}
          iconFamily="FontAwesome"
        />

        <PriceRangeSelector priceRange={priceRange} setPriceRange={setPriceRange} />

        <Text style={styles.inputHeading}>Choose your Vehicle</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputField}>
          <Text style={styles.inputText}>
            {vehicleId ? vehicleOptions.find(v => v._id === vehicleId)?.name : 'Select Vehicle'}
          </Text>
          <FontAwesome name="car" size={20} color="#888" />
        </TouchableOpacity>

        <Modal transparent={true} visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
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
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <PrimaryButton label="Book Now" onPress={handleBooking} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#E5D4ED' },
  contentContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 },
  container: { padding: 20, backgroundColor: '#F4E8FF', margin: 20, borderRadius: 15, elevation: 4, width: '90%' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 30, fontWeight: 'bold', color: '#000' },
  inputHeading: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 10, marginTop: 15 },
  inputField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E9D5FF', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, borderColor: '#d1c1e0', marginBottom: 20 },
  inputText: { fontSize: 16, color: '#888' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { backgroundColor: '#D8BFE8', width: 300, borderRadius: 5, paddingVertical: 10 },
  modalItem: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
  modalText: { fontSize: 18, color: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#888' },
});

export default BookRentalService;
