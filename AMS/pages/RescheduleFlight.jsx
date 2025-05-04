import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import useAuth from '../hooks/useAuth';
import DateSelector from '../components/DateSelector';
import InputField from '../components/InputField';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RescheduleFlight = ({ navigation }) => {
  const { isAuthenticated, userData, isLoading } = useAuth();
  const [bookedFlights, setBookedFlights] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newFlightClass, setNewFlightClass] = useState('');
  const [luggageWeight, setLuggageWeight] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchBookedFlights = async () => {
    if (!isAuthenticated || !userData?._id) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }
  
    try {
      setLoadingBookings(true);
  
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Auth Error', 'Token not found. Please login again.');
        return;
      }
  
      const response = await axios.get('http://192.168.1.7:7798/booked-flights', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = response.data.message === 'No bookings found.' ? [] : response.data;
      setBookedFlights(data);
      setShowDropdown(!showDropdown);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to fetch your bookings.');
    } finally {
      setLoadingBookings(false);
    }
  };
  

  const handleBookingSelect = (booking) => {
    setSelectedBooking(booking);
    setShowDropdown(false);
  };

  const handleRescheduleFlight = async () => {
    if (
      !selectedBooking?._id ||
      !newDate ||
      !newTime ||
      !newFlightClass ||
      !luggageWeight ||
      !seatNumber
    ) {
      Alert.alert('Validation error', 'Please fill all the fields.');
      return;
    }

    setLoadingBookings(true);

    let token;
    try {
      token = await AsyncStorage.getItem('userToken');
    } catch (error) {
      Alert.alert('Auth Error', 'Failed to retrieve token.');
      return;
    }

    if (!token) {
      Alert.alert('Auth Error', 'User Token not found. Please log in again.');
      return;
    }

    if (!isAuthenticated || !userData?._id) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    const formattedNewDate =
      newDate instanceof Date ? newDate.toISOString().split('T')[0] : newDate;

    const payload = {
      bookingId: selectedBooking._id,
      userId: userData._id,
      newDate: formattedNewDate,
      newTime,
      newFlightClass,
      luggageWeight: Number(luggageWeight),
      seatNumber,
    };

    console.log('🔄 Reschedule Payload:', payload);

    try {
      const response = await axios.post(
        'http://192.168.1.7:7798/reschedule-flight',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (
        data?.message === 'Flight rescheduled successfully' ||
        data?.message?.toLowerCase()?.includes('success')
      ) {
        Alert.alert('Success', 'Your flight has been rescheduled successfully.');
        setSelectedBooking(null);
        setNewDate('');
        setNewTime('');
        setNewFlightClass('');
        setLuggageWeight('');
        setSeatNumber('');
      } else {
        Alert.alert('Error', data?.error || 'Rescheduling failed.');
      }
    } catch (error) {
      console.error('❌ Reschedule error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Failed to reschedule flight.');
    } finally {
      setLoadingBookings(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground
        source={require('../assets/airplane.png')}
        style={styles.headerImage}
        imageStyle={{
          resizeMode: 'cover',
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
        }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.container}>
        <Text style={styles.heading}>Reschedule Flight</Text>

        <PrimaryButton label="Show Booked Flights" onPress={fetchBookedFlights} />

        {loadingBookings && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4B0082" />
            <Text style={[styles.inputText, styles.blackText]}>
              Loading your bookings...
            </Text>
          </View>
        )}

        {showDropdown && (
          <View style={styles.dropdownList}>
            <FlatList
              data={bookedFlights}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleBookingSelect(item)}
                >
                  <Text style={styles.modalText}>Flight: {item.flightId.flightNumber}</Text>
                  <Text style={styles.modalText}>From: {item.flightId.from}</Text>
                  <Text style={styles.modalText}>To: {item.flightId.to}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {selectedBooking && (
          <View style={styles.flightCard}>
            <Text style={styles.modalText}>Flight: {selectedBooking.flightId.flightNumber}</Text>
            <Text style={styles.modalText}>From: {selectedBooking.flightId.from}</Text>
            <Text style={styles.modalText}>To: {selectedBooking.flightId.to}</Text>
            <Text style={styles.modalText}>Date: {selectedBooking.flightId.date}</Text>
            <Text style={styles.modalText}>Time: {selectedBooking.flightId.time}</Text>
            <Text style={styles.modalText}>Class: {selectedBooking.flightId.flightClass}</Text>
            <Text style={styles.modalText}>Seat No: {selectedBooking.seatNumber}</Text>
          </View>
        )}

        <Text style={styles.label}>Select New Flight Details</Text>

        <DateSelector label="New Date" date={newDate} onDateChange={setNewDate} />

        <InputField
          placeholder="New Time"
          value={newTime}
          onChangeText={setNewTime}
          iconName="clock-o"
        />

        <InputField
          placeholder="New Flight Class"
          value={newFlightClass}
          onChangeText={setNewFlightClass}
          iconName="plane"
        />

        <InputField
          placeholder="Luggage Weight (kg)"
          value={luggageWeight}
          onChangeText={setLuggageWeight}
          iconName="suitcase"
        />

        <InputField
          placeholder="Seat Number (e.g. 12A)"
          value={seatNumber}
          onChangeText={setSeatNumber}
          iconName="chair"
        />

        <PrimaryButton
          label="Reschedule Flight"
          onPress={handleRescheduleFlight}
          style={{ marginTop: 40 }}
        />
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
    marginTop: -30,
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
    minHeight: 850,
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
  inputText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
  dropdownList: {
    width: '100%',
    backgroundColor: '#E0D3F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7B8EC',
    marginTop: 10,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalText: {
    fontSize: 16,
    color: '#000',
  },
  flightCard: {
    backgroundColor: '#E0D3F5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
});

export default RescheduleFlight;
