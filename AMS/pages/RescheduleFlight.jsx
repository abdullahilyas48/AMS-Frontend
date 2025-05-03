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
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import useAuth from '../hooks/useAuth'; 
import DateSelector from '../components/DateSelector'; 
import InputField from '../components/InputField';
import axios from 'axios';

const RescheduleFlight = () => {
  const { isAuthenticated, userData, isLoading } = useAuth(); 
  const [bookedFlights, setBookedFlights] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [availableOptions, setAvailableOptions] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newFlightClass, setNewFlightClass] = useState('');
  const [luggageWeight, setLuggageWeight] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [matchingFlights, setMatchingFlights] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);


  const fetchBookedFlights = async () => {
    if (!isAuthenticated || !userData?.email) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }
  
    try {
      setLoadingBookings(true);
      const response = await axios.get('http://192.168.1.7:7798/booked-flights');
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
  
  const fetchAvailableOptions = async (booking) => {
    try {
      const options = {
        dates: [booking.flightId.date],
        times: [booking.flightId.time],
        classes: ['Economy', 'Business', 'First Class'], 
        luggageOptions: [15, 20, 25], 
        seatNumbers: ['A1', 'B1', 'C1'], 
      };

      setAvailableOptions(options);
    } catch (error) {
      console.error('Error fetching available options:', error);
      Alert.alert('Error', 'Could not fetch rescheduling options.');
    }
  };

  const handleBookingSelect = async (booking) => {
    setSelectedBooking(booking);
    await fetchAvailableOptions(booking);
    setShowDropdown(false);
    setShowBookingModal(false);
  };

  const handleRescheduleFlight = async () => {
    if (!selectedBooking || !newDate || !newTime || !newFlightClass) {
      Alert.alert('Error', 'Missing required fields.');
      return;
    }
  
    try {
      const response = await axios.get('http://192.168.1.7:7798/flights');
      const allFlights = response.data;
  
      const formattedNewDate = newDate instanceof Date ? newDate.toISOString().split('T')[0] : '';
  
      const sameRouteFlights = allFlights.filter(
        (flight) =>
          flight.from.toLowerCase() === selectedBooking.flightId.from.toLowerCase() &&
          flight.to.toLowerCase() === selectedBooking.flightId.to.toLowerCase()
      );
  
      const exactMatch = sameRouteFlights.find(
        (flight) =>
          flight.date === formattedNewDate &&
          flight.time === newTime &&
          flight.flightClass.toLowerCase() === newFlightClass.toLowerCase()
      );
      
  
      if (exactMatch) {
        const rescheduleResponse = await axios.post(
          'http://192.168.1.7:7798/reschedule-flight',
          {
            bookingId: selectedBooking._id,
            newDate: formattedNewDate,
            newTime,
            newFlightClass,
            luggageWeight: Number(luggageWeight),
            seatNumber,
          }
        );
  
        if (rescheduleResponse.data?.message) {
          Alert.alert('Success', 'Your flight has been successfully rescheduled.');
          setSelectedBooking(null);
          setNewDate(null);
          setNewTime('');
          setNewFlightClass('');
          setLuggageWeight('');
          setSeatNumber('');
        } else {
          Alert.alert('Error', rescheduleResponse.data?.error || 'Unknown error occurred.');
        }
      } else {
        setMatchingFlights(sameRouteFlights); 
  
        let message = "The selected flight with your provided options is not available.\n";
        if (sameRouteFlights.length > 0) {
          message += "However, here are some alternative options on the same route:\n";
        } else {
          message += "No matching flights were found for your route and preferences.";
        }
  
        Alert.alert("Flight Not Available", message);
      }
    } catch (error) {
      console.error('Error during rescheduling:', error);
      Alert.alert('Error', 'Failed to process rescheduling request.');
    }
  };  


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Reschedule Flight</Text>
        <PrimaryButton label="Show Booked Flights" onPress={fetchBookedFlights} />
        
        {loadingBookings && <ActivityIndicator size="large" color="#000" />}

        {bookedFlights.length > 0 && selectedBooking ? (
          <>
            <View style={styles.flightDropdown}>
              <Text style={styles.flightText}>{`Flight: ${selectedBooking.flightId.flightNumber}`}</Text>
              <Text style={styles.flightText}>{`From: ${selectedBooking.flightId.from}`}</Text>
              <Text style={styles.flightText}>{`To: ${selectedBooking.flightId.to}`}</Text>
              <Text style={styles.flightText}>{`Date: ${selectedBooking.flightId.date}`}</Text>
              <Text style={styles.flightText}>{`Time: ${selectedBooking.flightId.time}`}</Text>
              <Text style={styles.flightText}>{`Class: ${selectedBooking.flightId.flightClass}`}</Text>
              <Text style={styles.flightText}>{`Seat No: ${selectedBooking.seatNumber}`}</Text>
            </View>
          </>
        ) : selectedBooking ? (
          <TouchableOpacity onPress={() => setShowBookingModal(true)} style={styles.flightDropdown}>
            <Text style={styles.flightText}>
              Flight: {selectedBooking.flightId.flightNumber}
              </Text>
  </TouchableOpacity>
) : null}

{showDropdown && (
  <View style={styles.dropdownContainer}>
    {bookedFlights.length === 0 ? (
      <Text style={styles.noFlightsText}>No booked flights available</Text>
    ) : (
      <FlatList
        data={bookedFlights}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleBookingSelect(item)}
            style={styles.dropdownItem}>
            <Text style={styles.flightText}>Flight: {item.flightId.flightNumber}</Text>
            <Text style={styles.flightText}>From: {item.flightId.from}</Text>
            <Text style={styles.flightText}>To: {item.flightId.to}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id.toString()}
      />
    )}
  </View>
)}

       
       <Text style={styles.subHeading}>Select New Flight Details</Text>
    <DateSelector label="New Date" date={newDate} onDateChange={setNewDate} />
    <InputField placeholder="New Time" value={newTime} onChangeText={setNewTime} />
    <InputField placeholder="New Flight Class" value={newFlightClass} onChangeText={setNewFlightClass} />
    <InputField placeholder="Luggage Weight (kg)" value={luggageWeight} onChangeText={setLuggageWeight} keyboardType="numeric" />
    <InputField placeholder="Seat Number" value={seatNumber} onChangeText={setSeatNumber} />
        <PrimaryButton label="Reschedule Flight" onPress={handleRescheduleFlight} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: '#E5D4ED',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    container: {
      padding: 20,
      backgroundColor: '#F4E8FF',
      margin: 20,
      marginTop: 50,
      borderRadius: 15,
      elevation: 4,
      width: '90%',
      minHeight: 600,
      justifyContent: 'center', 
    },
    title: {
      fontSize: 26,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#000',
    },
    subHeading: {
      fontSize: 18,
      fontWeight: '600',
      marginVertical: 15,
      color: '#333',
    },
    flightCard: {
      backgroundColor: '#E9D5FF',
      padding: 15,
      borderRadius: 10,
      marginVertical: 7,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      width: 300,
    },
    noFlightsText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginVertical: 10,
      },
      
    flightText: {
      fontSize: 14,
      color: '#333',
    },
    flightDropdown: {
      backgroundColor: '#E9D5FF',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#ccc',
      width: '95%', 
      alignSelf: 'center',
    },
    modalWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', 
    },
    
    modalContainer: {
      backgroundColor: '#F4E8FF',
      padding: 20,
      borderRadius: 10,
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center',     
    },
    dropdownContainer: {
        backgroundColor: '#D8B4FE',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop: 10,
        width: '100%',
        maxHeight: 200,
      },
      dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      
    modalItem: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#D8B4FE',
    },
  });

export default RescheduleFlight;
