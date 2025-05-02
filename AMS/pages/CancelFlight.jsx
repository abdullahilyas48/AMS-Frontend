import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView,
} from 'react-native';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import PrimaryButton from '../components/PrimaryButton';

const CancelFlightBooking = () => {
  const { userData } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    if (!userData || !userData.email) {
      Alert.alert('Error', 'You must be logged in to view bookings.');
      console.log('User not logged in');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching bookings for user:', userData.email);
     
      const response = await axios.get(`http://192.168.1.7:7798/booked-flights?email=${userData.email}`);
      console.log('Response from /booked-flights:', response.data);

      if (response.data.message === 'No bookings found.') {
        setBookings([]);
      } else if (Array.isArray(response.data.bookings)) {
        setBookings(response.data.bookings);
      } else if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        console.warn('Unexpected response format. Falling back.');
        setBookings([]);
      }
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      Alert.alert('Error', 'Could not fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingId) {
      Alert.alert('Error', 'Please select a booking to cancel.');
      console.log('No booking selected.');
      return;
    }

    console.log('Attempting to cancel booking with ID:', selectedBookingId);

    try {
      const res = await axios.delete(`http://192.168.1.7:7798/cancel-flight-booking/${selectedBookingId}`);
      console.log('Response from server:', res.data);

      Alert.alert('Success', 'Booking cancelled successfully.');
      fetchBookings(); // refresh bookings
    } catch (err) {
      console.error('Cancellation failed:', err.response?.data || err.message);
      Alert.alert('Error', 'Cancellation failed.');
    }
  };

  useEffect(() => {
    console.log('User on mount:', userData);
    if (userData && userData.email) {
      fetchBookings();
    }
  }, [userData]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Cancel Flight Booking</Text>

        {loading && <Text style={styles.loadingText}>Loading your bookings...</Text>}

        {!loading && bookings.length === 0 && (
          <Text style={styles.noBookingsText}>No flight bookings found.</Text>
        )}

        {bookings.map((booking) => (
          <TouchableOpacity
            key={booking._id}
            style={[styles.bookingCard, selectedBookingId === booking._id && styles.selectedCard]}
            onPress={() => setSelectedBookingId(booking._id)}
          >
            <Text style={styles.bookingText}>Flight No: {booking.flightId?.flightNumber}</Text>
            <Text style={styles.bookingText}>From: {booking.flightId?.from}</Text>
            <Text style={styles.bookingText}>To: {booking.flightId?.to}</Text>
            <Text style={styles.bookingText}>Date: {booking.flightId?.date?.split('T')[0]}</Text>
            <Text style={styles.bookingText}>Seat No: {booking.seatNumber}</Text>
            <Text style={styles.bookingText}>Price: ${booking.price}</Text>
          </TouchableOpacity>
        ))}

        {bookings.length > 0 && (
            <PrimaryButton onPress={handleCancelBooking} label="Cancel Flight" />
          
        )}
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
  bookingCard: {
    backgroundColor: '#E9D5FF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedCard: {
    borderColor: '#6B21A8',
    backgroundColor: '#D8BFE8',
  },
  bookingText: {
    fontSize: 14,
    color: '#333',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  noBookingsText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default CancelFlightBooking;
