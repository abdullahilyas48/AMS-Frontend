import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateSelector from '../components/DateSelector';
import TimeSelector from '../components/TimeSelector';
import InputField from '../components/InputField';
import PriceRangeSelector from '../components/PriceRangeSelector';
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const BookRentalService = () => {
  const { userData, isLoading } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [destination, setDestination] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (!isLoading && userData?._id) {
      fetchVehicles();
    }
  }, [isLoading, userData?._id, priceRange]);  

  useEffect(() => {
    console.log('UserData:', userData);
  }, [userData]);
  
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`http://192.168.1.7:7798/vehicles?maxPrice=${priceRange[1]}&minPrice=${priceRange[0]}`);
      setVehicles(response.data);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch available vehicles.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  if (!userData?._id) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>User not authenticated. Please log in.</Text>
      </View>
    );
  }
  
  
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !destination || !selectedVehicle) {
      Alert.alert('Missing Info', 'Please complete all fields before booking.');
      return;
    }

    try {
      const payload = {
        userId: userData._id,
        vehicleId: selectedVehicle._id,
        date: selectedDate,
        time: selectedTime,
        destination,
      };

      const response = await axios.post('http://192.168.1.7:7798/book-vehicles', payload);
      const booking = response.data.booking;

Alert.alert(
  '✅ Booking Successful',
  `Booking ID: ${booking._id}\nVehicle ID: ${booking.vehicleId}\nDate: ${booking.date}\nTime: ${booking.time}\nDestination: ${booking.destination}`
);


      fetchVehicles(); // refresh list after booking
    } catch (error) {
      console.error('Booking failed:', error.response?.data || error.message);
      Alert.alert('Booking Failed', 'Please try again later.');
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setDropdownVisible(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Book a Rental Vehicle</Text>

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

        <Text style={styles.label}>Select a Vehicle</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownVisible(true)}>
          <Text style={styles.dropdownText}>
            {selectedVehicle
              ? `${selectedVehicle.name} (Rs. ${selectedVehicle.price})`
              : 'Tap to select a vehicle'}
          </Text>
          <FontAwesome name="car" size={20} color="#888" />
        </TouchableOpacity>

        <Modal transparent visible={dropdownVisible} animationType="fade" onRequestClose={() => setDropdownVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.modalItem} onPress={() => handleVehicleSelect(item)}>
                        <Text style={styles.modalText}>{item.name} - Rs. {item.price}</Text>
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
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#E5D4ED',
    alignItems: 'center',
    paddingBottom: 40,
  },
  container: {
    backgroundColor: '#F4E8FF',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    elevation: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 15,
    marginBottom: 10,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E9D5FF',
    padding: 12,
    borderRadius: 10,
    borderColor: '#d1c1e0',
    borderWidth: 1,
    marginBottom: 20,
  },
  dropdownText: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
  },
});

export default BookRentalService;
