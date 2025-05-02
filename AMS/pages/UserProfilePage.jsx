import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfilePage = ({ navigation }) => {
  const { userData, setAuthState, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [parkingBookings, setParkingBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://192.168.1.7:7798/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setAuthState(prev => ({
        ...prev,
        userData: data
      }));
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParkingBookings = async () => {
    try {
      if (!userData?._id) return;
      
      const response = await fetch(
        `http://192.168.1.7:7798/user-parking-reservations/${userData._id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setParkingBookings(data);
    } catch (error) {
      console.error('Error fetching parking bookings:', error);
      alert('Failed to load parking bookings. Please try again later.');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userData?._id) {
      fetchParkingBookings();
    }
  }, [userData?._id]);

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'UserHome' }],
    });
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `http://192.168.1.7:7798/cancel-parking-reservation/${bookingId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh bookings after successful cancellation
      fetchParkingBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again later.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={80} color="#D1A7F7" />
          </View>
          <Text style={styles.welcomeText}>Welcome back, {userData?.name || 'User'}!</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color="#D1A7F7" />
              <Text style={styles.infoText}>{userData?.email || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="ribbon-outline" size={18} color="#D1A7F7" />
              <Text style={styles.infoText}>Status: {userData?.status || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Airport Parking Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Airport Parking</Text>
          {loadingBookings ? (
            <View style={styles.card}>
              <ActivityIndicator size="small" color="#D1A7F7" />
            </View>
          ) : parkingBookings.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.noBookingsText}>No active parking bookings</Text>
            </View>
          ) : (
            parkingBookings.map((booking) => (
              <View key={booking._id} style={[styles.card, { marginBottom: 15 }]}>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Spot Number:</Text>
                  <Text style={styles.cardValue}>
                    {booking.spot?.terminalLocation}{booking.spot?.number}
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Date:</Text>
                  <Text style={styles.cardValue}>
                    {new Date(booking.reservationDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Time:</Text>
                  <Text style={styles.cardValue}>
                    {booking.startTime} - {booking.endTime}
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Vehicle:</Text>
                  <Text style={styles.cardValue}>{booking.vehicleType}</Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>License:</Text>
                  <Text style={styles.cardValue}>{booking.licensePlate}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleCancelBooking(booking._id)}
                >
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Other sections... */}
        {renderSection('Active Flights', [
          'Airline:',
          'Flight Number:',
          'Departure:',
          'Destination:'
        ])}

        {renderSection('Hotel Bookings', [
          'Hotel Name:',
          'Check-in:',
          'Check-out:',
          'Room Type:'
        ])}
      </ScrollView>
    </View>
  );

  function renderSection(title, items) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>
          {items.map((item, index) => (
            <View key={index} style={styles.cardItem}>
              <Text style={styles.cardLabel}>{item}</Text>
              <Text style={styles.cardValue}>-</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#D1A7F7',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    color: 'white',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'center',
  },
  avatarContainer: {
    backgroundColor: '#F1D9FF',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D1A7F7',
    marginBottom: 10,
    marginLeft: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  cardLabel: {
    fontSize: 15,
    color: '#D1A7F7',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 15,
    color: '#333',
  },
  noBookingsText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 15,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfilePage;