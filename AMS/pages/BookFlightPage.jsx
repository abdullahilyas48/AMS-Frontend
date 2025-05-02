import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import DateSelector from '../components/DateSelector';
import useAuth from '../hooks/useAuth'; // Updated hook

const BookFlight = () => {
  const { isAuthenticated, userData, isLoading } = useAuth(); // Updated hook destructuring

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [flightClass, setFlightClass] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [luggageWeight, setLuggageWeight] = useState('');
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [seatNumber, setSeatNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const handleSearchFlights = async () => {
    setLoading(true);
    setSearchInitiated(true);

    try {
      const formattedDate = new Date(date);
      if (isNaN(formattedDate)) {
        Alert.alert('Error', 'Please select a valid date.');
        return;
      }

      const formattedDateString = formattedDate.toISOString().split('T')[0];

      const fullParams = {
        ...(from && { from }),
        ...(to && { to }),
        ...(formattedDateString && { date: formattedDateString }),
        ...(flightClass.trim() && { flightClass: flightClass.trim() }),
        ...(maxPrice && { maxPrice: Number(maxPrice) }),
        ...(luggageWeight && { luggageWeight: Number(luggageWeight) }),
      };

      const response = await axios.get('http://192.168.1.7:7798/flights', { params: fullParams });

      if (Array.isArray(response.data) && response.data.length > 0) {
        setAvailableFlights(response.data);
      } else {
        const noLuggageParams = { ...fullParams };
        delete noLuggageParams.luggageWeight;

        const noLuggageResp = await axios.get('http://192.168.1.7:7798/flights', { params: noLuggageParams });
        if (noLuggageResp.data.length > 0) {
          Alert.alert('Luggage Too Heavy', `No flight allows ${luggageWeight}kg. Showing alternatives.`);
          setAvailableFlights(noLuggageResp.data);
          return;
        }

        const noPriceParams = { ...noLuggageParams };
        delete noPriceParams.maxPrice;

        const noPriceResp = await axios.get('http://192.168.1.7:7798/flights', { params: noPriceParams });
        if (noPriceResp.data.length > 0) {
          Alert.alert('Price Too Low', `No flights under that price. Showing other options.`);
          setAvailableFlights(noPriceResp.data);
          return;
        }

        const noDateParams = { from, to, flightClass: flightClass.trim() };
        const noDateResp = await axios.get('http://192.168.1.7:7798/flights', { params: noDateParams });
        if (noDateResp.data.length > 0) {
          Alert.alert('No Flights on Selected Date', `But flights are available on other dates.`);
          setAvailableFlights(noDateResp.data);
          return;
        }

        const fallback = await axios.get('http://192.168.1.7:7798/flights');
        Alert.alert('No Exact Matches', 'Showing all flights.');
        setAvailableFlights(fallback.data || []);
      }
    } catch (error) {
      console.error('Error fetching flights:', error);
      Alert.alert('Error', 'Failed to fetch flights.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = async () => {
    if (!isAuthenticated || !userData?.email) {
      Alert.alert('Error', 'You must be logged in to book a flight.');
      return;
    }

    if (!selectedFlightId) {
      Alert.alert('Error', 'Please select a flight to book.');
      return;
    }

    if (!seatNumber) {
      Alert.alert('Error', 'Please select a seat number.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.7:7798/book-flight', {
        userEmail: userData?.email,  // Ensure the email is available
        flightId: selectedFlightId,
        luggageWeight: Number(luggageWeight),
        seatNumber,
      });

      if (response.data.message === 'Flight booked successfully') {
        Alert.alert('Success', 'Your flight has been booked!');
        setBookingId(response.data.booking._id);
        console.log('Booking response:', response.data);
      } else {
        Alert.alert('Booking Failed', response.data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error booking flight:', error);
      Alert.alert('Error', error.response?.data?.error || 'Booking failed.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Book a Flight</Text>

        <InputField placeholder="From" value={from} onChangeText={setFrom} />
        <InputField placeholder="To" value={to} onChangeText={setTo} />
        <DateSelector label="Date" date={date} onDateChange={setDate} />
        <InputField placeholder="Flight Class" value={flightClass} onChangeText={setFlightClass} />
        <InputField placeholder="Max Price" value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" />
        <InputField placeholder="Luggage Weight (kg)" value={luggageWeight} onChangeText={setLuggageWeight} keyboardType="numeric" />
        <InputField placeholder="Seat Number (e.g. 12A)" value={seatNumber} onChangeText={setSeatNumber} />
        <PrimaryButton label="Search Flights" onPress={handleSearchFlights} />

        {loading && <Text style={styles.loadingText}>Loading flights...</Text>}

        {availableFlights.length > 0 && (
          <>
            <Text style={styles.subHeading}>Available Flights</Text>
            {availableFlights.map((flight) => (
              <TouchableOpacity
                key={flight._id}
                style={[styles.flightCard, selectedFlightId === flight._id && styles.selectedCard]}
                onPress={() => setSelectedFlightId(flight._id)}
              >
                <Text style={styles.flightText}>Flight Number: {flight.flightNumber}</Text>
                <Text style={styles.flightText}>Airline: {flight.airline}</Text>
                <Text style={styles.flightText}>From: {flight.from}</Text>
                <Text style={styles.flightText}>To: {flight.to}</Text>
                <Text style={styles.flightText}>Time: {flight.time}</Text>
                <Text style={styles.flightText}>Class: {flight.flightClass}</Text>
                <Text style={styles.flightText}>Price: ${flight.price}</Text>
                <Text style={styles.flightText}>Max Luggage: {flight.maxLuggageWeight}kg</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {searchInitiated && availableFlights.length === 0 && !loading && (
          <Text style={styles.noFlightsText}>No flights available for the selected filters.</Text>
        )}

        <PrimaryButton label="Book Selected Flight" onPress={handleBookFlight} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#E5D4ED',
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  noFlightsText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 10,
  },
  flightCard: {
    padding: 15,
    backgroundColor: '#D7B7FF',
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    backgroundColor: '#D7B7FF',
  },
  flightText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default BookFlight;
