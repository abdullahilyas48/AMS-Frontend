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
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import DateSelector from '../components/DateSelector';
import TimeSelector from '../components/TimeSelector';
import InputField from '../components/InputField';
import PriceRangeSelector from '../components/PriceRangeSelector';
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const BookRentalService = ({ navigation }) => {
  const { userData, isLoading } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [destination, setDestination] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && userData?._id) fetchVehicles();
  }, [isLoading, userData?._id, priceRange]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://192.168.1.7:7798/vehicles?maxPrice=${priceRange[1]}&minPrice=${priceRange[0]}`);
      setVehicles(res.data);
    } catch {
      Alert.alert('Error', 'Unable to fetch available vehicles.');
    } finally {
      setLoading(false);
    }
  };

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
      const res = await axios.post('http://192.168.1.7:7798/book-vehicles', payload);
      const booking = res.data.booking;
      Alert.alert('✅ Booking Successful', `Booking ID: ${booking._id}\nVehicle ID: ${booking.vehicleId}\nDate: ${booking.date}\nTime: ${booking.time}\nDestination: ${booking.destination}`);
      fetchVehicles();
    } catch (error) {
      Alert.alert('Booking Failed', 'Please try again later.');
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setDropdownVisible(false); // Hide dropdown after selection
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground
        source={require('../assets/airplane.png')}
        style={styles.headerImage}
        imageStyle={{ resizeMode: 'cover', borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.container}>
        <Text style={styles.heading}>Book a Rental Vehicle</Text>

        <DateSelector label="Select Date" date={selectedDate} onDateChange={setSelectedDate} labelStyle={styles.label} />
        <TimeSelector label="Select Time" time={selectedTime} onTimeChange={setSelectedTime} />
        <InputField placeholder="Enter Destination" iconName="location-arrow" value={destination} onChangeText={setDestination} iconFamily="FontAwesome" />
        <PriceRangeSelector priceRange={priceRange} setPriceRange={setPriceRange} />

        <Text style={styles.label}>Select a Vehicle</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownVisible(!dropdownVisible)}>
          <Text style={[styles.inputText, styles.blackText]}>{selectedVehicle ? `${selectedVehicle.name} (Rs. ${selectedVehicle.price})` : 'Tap to select a vehicle'}</Text>
          <FontAwesome name="car" size={20} color="#000" />
        </TouchableOpacity>

        {/* Inline Dropdown List */}
        {dropdownVisible && !loading && (
          <View style={styles.dropdownList}>
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
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4B0082" />
            <Text style={[styles.inputText, styles.blackText]}>Loading vehicles...</Text>
          </View>
        ) : null}

        <PrimaryButton label="Book Now" onPress={handleBooking} style={{ marginTop: 40 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: '#E5D4ED',
    paddingVertical: 30,
    alignItems: 'center',
  },
  headerImage: {
    width: '107%',
    height: 200,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    marginTop: -30,  // Move the image upwards
  },
  backButton: {
    marginTop: 40,
    right: -15,
  },
  container: {
    width: '95%',
    marginTop: -18,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    height: 850,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
    marginBottom: 6,
  },
  blackText: {
    color: '#333',
    fontSize: 15,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#E0D3F5',
    borderColor: '#C7B8EC',
    borderWidth: 1,
    marginBottom: 10, // Space for the dropdown
  },
  dropdownList: {
    width: '100%',
    backgroundColor: '#E0D3F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7B8EC',
    marginTop: 5,
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
    alignItems: 'center',
    padding: 20,
  },

  // Add a common style for input text
  inputText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
});

export default BookRentalService;
