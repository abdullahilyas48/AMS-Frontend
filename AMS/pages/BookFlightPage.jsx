import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import DateSelector from '../components/DateSelector';
import useAuth from '../hooks/useAuth';

const BookFlight = () => {
  const navigation = useNavigation();
  const { isAuthenticated, userData } = useAuth();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(null);
  const [flightClass, setFlightClass] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [luggageWeight, setLuggageWeight] = useState('');
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [seatNumber, setSeatNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleSearchFlights = async () => {
    setLoading(true);
    setSearchInitiated(true);
    setSelectedFlightId(null);

    try {
      const formattedDate = date instanceof Date ? date : new Date(date);
      const formattedDateString = !isNaN(formattedDate) ? formattedDate.toISOString().split('T')[0] : '';

      const baseParams = { from, to };
      const dateParams = formattedDateString ? { date: formattedDateString } : {};
      const classParams = flightClass ? { flightClass: flightClass.toLowerCase() } : {};
      const priceParams = maxPrice ? { maxPrice: Number(maxPrice) } : {};
      const luggageParams = luggageWeight ? { luggageWeight: Number(luggageWeight) } : {};

      const params1 = { ...baseParams, ...dateParams, ...classParams, ...priceParams, ...luggageParams };
      let response = await axios.get('http://192.168.1.7:7798/flights', { params: params1 });

      if (response.data.length > 0) {
        setAvailableFlights(response.data);
        setLoading(false);
        return;
      }

      const params2 = { ...baseParams, ...classParams, ...priceParams, ...luggageParams };
      response = await axios.get('http://192.168.1.7:7798/flights', { params: params2 });

      if (response.data.length > 0) {
        Alert.alert('No Flights on Selected Date', 'Showing flights on other dates.');
        setAvailableFlights(response.data);
        setLoading(false);
        return;
      }

      const params3 = { ...baseParams, ...priceParams, ...luggageParams };
      response = await axios.get('http://192.168.1.7:7798/flights', { params: params3 });

      if (response.data.length > 0) {
        Alert.alert('No Flights in Selected Class', 'Showing flights in all classes.');
        setAvailableFlights(response.data);
        setLoading(false);
        return;
      }

      response = await axios.get('http://192.168.1.7:7798/flights', { params: baseParams });

      if (response.data.length > 0) {
        Alert.alert('No Flights With Price/Luggage Filters', 'Showing all available flights for this route.');
        setAvailableFlights(response.data);
        setLoading(false);
        return;
      }

      response = await axios.get('http://192.168.1.7:7798/flights');
      Alert.alert('No Matches Found', 'Showing all available flights.');
      setAvailableFlights(response.data || []);
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
        userId: userData._id,
        userEmail: userData?.email,
        flightId: selectedFlightId,
        luggageWeight: Number(luggageWeight),
        seatNumber,
      });

      if (response.data.message === 'Flight booked successfully') {
        const booking = response.data.booking;
        const bookedAtDate = new Date(booking.bookedAt).toLocaleString();

        Alert.alert(
          'Success',
          `Your flight has been booked!\n\n` +
          `Booking ID: ${booking._id}\n` +
          `User ID: ${booking.userId}\n` +
          `Flight ID: ${booking.flightId}\n` +
          `Luggage Weight: ${booking.luggageWeight} kg\n` +
          `Seat Number: ${booking.seatNumber}\n` +
          `Booked At: ${bookedAtDate}`
        );
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
      <ImageBackground
        source={require('../assets/airplane.png')}
        style={styles.headerImage}
        imageStyle={{ resizeMode: 'cover', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.container}>
        <Text style={styles.title}>Book your flight</Text>

        <InputField placeholder="From" value={from} onChangeText={setFrom} iconName="plane" />
        <InputField placeholder="To" value={to} onChangeText={setTo} iconName="map-marker" />
        <DateSelector label="Travel Date" date={date} onDateChange={setDate} />

        {/* Flight Class Label */}
        <Text style={styles.label}>Flight Class</Text>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowPicker(!showPicker)}
        >
          <View style={styles.dropdownContent}>
            <Text
              style={[
                styles.dropdownButtonText,
                flightClass === 'first Class' && { color: '#333' }, // black text for First Class
              ]}
            >
              {flightClass ? flightClass.charAt(0).toUpperCase() + flightClass.slice(1) : 'Select Class'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#555" />
          </View>
        </TouchableOpacity>

        {showPicker && (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={flightClass}
              onValueChange={(itemValue) => {
                setFlightClass(itemValue);
                setShowPicker(false);
              }}
              style={styles.pickerStyle}
              dropdownIconColor="#555"
            >
              <Picker.Item label="Select Class" value="" />
              <Picker.Item label="Economy" value="economy" />
              <Picker.Item label="Business" value="business" />
              <Picker.Item label="First Class" value="first Class" />
            </Picker>
          </View>
        )}

        <InputField placeholder="Max Price" value={maxPrice} onChangeText={setMaxPrice} iconName="dollar" />
        <InputField placeholder="Luggage Weight (kg)" value={luggageWeight} onChangeText={setLuggageWeight} iconName="suitcase" />
        <InputField placeholder="Seat Number (e.g. 12A)" value={seatNumber} onChangeText={setSeatNumber} iconName="chair" />

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

        {selectedFlightId && (
          <PrimaryButton label="Book Selected Flight" onPress={handleBookFlight} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#E5D4ED',
  },
  headerImage: {
    height: 200,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  backButton: {
    marginTop: 40,
  },
  container: {
    marginTop: -40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 20,
  },
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 15,
    color: '#4B0082',
  },
  label: {
    marginBottom: 5,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  dropdownButton: {
    backgroundColor: '#E0D3F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  dropdownButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  pickerStyle: {
    color: '#333',
    backgroundColor: '#E0D3F5',
    fontSize: 16,
    fontWeight: '500',
  },
  pickerWrapper: {
    backgroundColor: '#E5D4ED',
    borderRadius: 10,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
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
    backgroundColor: '#EAD1FF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  selectedCard: {
    backgroundColor: '#D7B7FF',
    borderWidth: 2,
    borderColor: '#4B0082',
  },
  flightText: {
    fontSize: 14,
    marginBottom: 3,
    color: '#333',
  },
});

export default BookFlight;
