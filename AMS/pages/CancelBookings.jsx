import React, { useEffect, useState } from 'react';
import { View, Text, Picker, Button, ActivityIndicator, Alert } from 'react-native';
import useAuth from '../hooks/useAuth';

const CancelBookings = () => {
  const { authState } = useAuth();
  const [bookingType, setBookingType] = useState('lounge');
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://192.168.100.18:7798';

  const fetchBookings = async () => {
    setLoading(true);
    const endpoint = {
      lounge: '/my-lounge-bookings',
      hotel: '/my-hotel-bookings',
      vehicle: '/my-vehicle-bookings',
    }[bookingType];

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      Alert.alert("Error", "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async () => {
    if (!selectedBookingId) return;

    const endpoint = {
      lounge: `/cancel-lounge-booking/${selectedBookingId}`,
      hotel: `/cancel-hotel-booking/${selectedBookingId}`,
      vehicle: `/cancel-vehicle-booking/${selectedBookingId}`,
    }[bookingType];

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
        }
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', result.message);
        fetchBookings(); // refresh list
        setSelectedBookingId('');
      } else {
        throw new Error(result.error || 'Cancellation failed');
      }
    } catch (err) {
      console.error('Cancellation error:', err);
      Alert.alert("Error", err.message);
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchBookings();
    }
  }, [bookingType, authState.isAuthenticated]);

  if (authState.isLoading || loading) return <ActivityIndicator size="large" color="#0000ff" />;

  // Check if authState is valid before rendering the component content
  if (!authState.isAuthenticated) {
    return <View><Text>You are not authenticated. Please log in.</Text></View>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Cancel Booking</Text>

      <Text>Select Booking Type:</Text>
      <Picker
        selectedValue={bookingType}
        onValueChange={(value) => {
          setBookingType(value);
          setSelectedBookingId('');
        }}
      >
        <Picker.Item label="Lounge" value="lounge" />
        <Picker.Item label="Hotel" value="hotel" />
        <Picker.Item label="Vehicle" value="vehicle" />
      </Picker>

      <Text>Select Your Booking:</Text>
      <Picker
        selectedValue={selectedBookingId}
        onValueChange={(value) => setSelectedBookingId(value)}
      >
        <Picker.Item label="-- Select Booking --" value="" />
        {bookings.map((booking) => (
          <Picker.Item
            key={booking._id}
            label={`ID: ${booking._id} - Date: ${booking.date}`}
            value={booking._id}
          />
        ))}
      </Picker>

      <Button
        title="Cancel Booking"
        onPress={cancelBooking}
        disabled={!selectedBookingId}
      />
    </View>
  );
};

export default CancelBookings;
