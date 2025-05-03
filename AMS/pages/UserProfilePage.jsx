import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfilePage = ({ navigation }) => {
  const { userData, setAuthState, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [parkingBookings, setParkingBookings] = useState([]);
  const [flightBookings, setFlightBookings] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loungeBookings, setLoungeBookings] = useState([]);
  const [vehicleBookings, setVehicleBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState({
    parking: true,
    flights: true,
    hotels: true,
    lounges: true,
    vehicles: true
  });
  const [error, setError] = useState(null);

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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch user details: ${errorText}`);
      }

      const data = await response.json();
      setAuthState(prev => ({
        ...prev,
        userData: data
      }));
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchParkingBookings = async () => {
    try {
      setLoadingBookings(prev => ({ ...prev, parking: true }));
      setError(null);
      
      if (!token || !userData?._id) return;

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
        const errorText = await response.text();
        throw new Error(`Parking: ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      setParkingBookings(data);
    } catch (error) {
      console.error('Parking booking error:', error);
      setError(error.message);
    } finally {
      setLoadingBookings(prev => ({ ...prev, parking: false }));
    }
  };

  const fetchFlightBookings = async () => {
    try {
      setLoadingBookings(prev => ({ ...prev, flights: true }));
      setError(null);
      
      if (!token || !userData?._id) return;

      const response = await fetch(
        `http://192.168.1.7:7798/user-flight-bookings/${userData._id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Flights: ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      setFlightBookings(data);
    } catch (error) {
      console.error('Flight booking error:', error);
      setError(error.message);
    } finally {
      setLoadingBookings(prev => ({ ...prev, flights: false }));
    }
  };

  const fetchHotelBookings = async () => {
    try {
      setLoadingBookings(prev => ({ ...prev, hotels: true }));
      setError(null);
      
      if (!token || !userData?._id) return;

      const response = await fetch(
        `http://192.168.1.7:7798/user-hotel-bookings/${userData._id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hotels: ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      setHotelBookings(data);
    } catch (error) {
      console.error('Hotel booking error:', error);
      setError(error.message);
    } finally {
      setLoadingBookings(prev => ({ ...prev, hotels: false }));
    }
  };

  const fetchLoungeBookings = async () => {
    try {
      setLoadingBookings(prev => ({ ...prev, lounges: true }));
      setError(null);
      
      if (!token || !userData?._id) return;

      const response = await fetch(
        `http://192.168.1.7:7798/user-lounge-bookings/${userData._id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lounges: ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      setLoungeBookings(data);
    } catch (error) {
      console.error('Lounge booking error:', error);
      setError(error.message);
    } finally {
      setLoadingBookings(prev => ({ ...prev, lounges: false }));
    }
  };

  const fetchVehicleBookings = async () => {
    try {
      setLoadingBookings(prev => ({ ...prev, vehicles: true }));
      setError(null);
      
      if (!token || !userData?._id) return;

      const response = await fetch(
        `http://192.168.1.7:7798/user-vehicle-bookings/${userData._id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Vehicles: ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      setVehicleBookings(data);
    } catch (error) {
      console.error('Vehicle booking error:', error);
      setError(error.message);
    } finally {
      setLoadingBookings(prev => ({ ...prev, vehicles: false }));
    }
  };

  const fetchAllBookings = async () => {
    await Promise.all([
      fetchParkingBookings(),
      fetchFlightBookings(),
      fetchHotelBookings(),
      fetchLoungeBookings(),
      fetchVehicleBookings()
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserDetails();
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    if (userData?._id) {
      fetchAllBookings();
    }
  }, [userData?._id]);

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'UserHome' }],
    });
  };

  const handleCancelBooking = async (bookingId, type) => {
    try {
      if (!token) {
        alert('Session expired. Please login again.');
        navigation.navigate('Login');
        return;
      }

      let endpoint = '';
      switch(type) {
        case 'parking':
          endpoint = `cancel-parking-reservation/${bookingId}`;
          break;
        case 'flight':
          endpoint = `cancel-flight-booking/${bookingId}`;
          break;
        case 'hotel':
          endpoint = `cancel-hotel-booking/${bookingId}`;
          break;
        case 'lounge':
          endpoint = `cancel-lounge-booking/${bookingId}`;
          break;
        case 'vehicle':
          endpoint = `cancel-vehicle-booking/${bookingId}`;
          break;
        default:
          throw new Error('Invalid booking type');
      }

      const response = await fetch(
        `http://192.168.1.7:7798/${endpoint}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to cancel booking: ${errorText}`);
      }

      fetchAllBookings();
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(error.message.includes('Network request failed') 
        ? 'Network error. Please check your internet connection.'
        : 'Failed to cancel booking. Please try again later.');
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchAllBookings();
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
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

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
          {loadingBookings.parking ? (
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
                    {booking.spot ? `${booking.spot.terminalLocation}${booking.spot.number}` : 'N/A'}
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
                  onPress={() => handleCancelBooking(booking._id, 'parking')}
                >
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Flight Bookings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Bookings</Text>
          {loadingBookings.flights ? (
            <View style={styles.card}>
              <ActivityIndicator size="small" color="#D1A7F7" />
            </View>
          ) : flightBookings.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.noBookingsText}>No active flight bookings</Text>
            </View>
          ) : (
            flightBookings.map((booking) => (
              <View key={booking._id} style={[styles.card, { marginBottom: 15 }]}>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Flight:</Text>
                  <Text style={styles.cardValue}>
                    {booking.flightId?.airline || 'N/A'} {booking.flightId?.flightNumber || ''}
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Route:</Text>
                  <Text style={styles.cardValue}>
                    {booking.flightId?.from || 'N/A'} → {booking.flightId?.to || 'N/A'}
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Date:</Text>
                  <Text style={styles.cardValue}>
                    {new Date(booking.flightId?.date).toLocaleDateString() || 'N/A'}
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Time:</Text>
                  <Text style={styles.cardValue}>
                    {booking.flightId?.time || 'N/A'} - {booking.flightId?.arrivalTime || 'N/A'}
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Class:</Text>
                  <Text style={styles.cardValue}>{booking.flightId?.flightClass || 'N/A'}</Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Seat:</Text>
                  <Text style={styles.cardValue}>{booking.seatNumber || 'N/A'}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleCancelBooking(booking._id, 'flight')}
                >
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Hotel Bookings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hotel Bookings</Text>
          {loadingBookings.hotels ? (
            <View style={styles.card}>
              <ActivityIndicator size="small" color="#D1A7F7" />
            </View>
          ) : hotelBookings.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.noBookingsText}>No active hotel bookings</Text>
            </View>
          ) : (
            hotelBookings.map((booking) => (
              <View key={booking._id} style={[styles.card, { marginBottom: 15 }]}>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Hotel:</Text>
                  <Text style={styles.cardValue}>{booking.hotelName || 'N/A'}</Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Room Type:</Text>
                  <Text style={styles.cardValue}>{booking.roomType || 'N/A'}</Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Check-in:</Text>
                  <Text style={styles.cardValue}>
                    {new Date(booking.date).toLocaleDateString() || 'N/A'}
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Price:</Text>
                  <Text style={styles.cardValue}>${booking.price || 'N/A'}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleCancelBooking(booking._id, 'hotel')}
                >
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Lounge Bookings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lounge Bookings</Text>
          {loadingBookings.lounges ? (
            <View style={styles.card}>
              <ActivityIndicator size="small" color="#D1A7F7" />
            </View>
          ) : loungeBookings.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.noBookingsText}>No active lounge bookings</Text>
            </View>
          ) : (
            loungeBookings.map((booking) => (
              <View key={booking._id} style={[styles.card, { marginBottom: 15 }]}>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Lounge:</Text>
                  <Text style={styles.cardValue}>
                    {booking.loungeId?.name || 'N/A'}
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Date:</Text>
                  <Text style={styles.cardValue}>
                    {new Date(booking.date).toLocaleDateString() || 'N/A'}
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Time:</Text>
                  <Text style={styles.cardValue}>{booking.time || 'N/A'}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleCancelBooking(booking._id, 'lounge')}
                >
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Vehicle Rental Bookings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Rentals</Text>
          {loadingBookings.vehicles ? (
            <View style={styles.card}>
              <ActivityIndicator size="small" color="#D1A7F7" />
            </View>
          ) : vehicleBookings.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.noBookingsText}>No active vehicle rentals</Text>
            </View>
          ) : (
            vehicleBookings.map((booking) => (
              <View key={booking._id} style={[styles.card, { marginBottom: 15 }]}>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Vehicle:</Text>
                  <Text style={styles.cardValue}>
                    {booking.vehicleId?.name || 'N/A'} ({booking.vehicleId?.type || 'N/A'})
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Date:</Text>
                  <Text style={styles.cardValue}>
                    {new Date(booking.date).toLocaleDateString() || 'N/A'}
                  </Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Time:</Text>
                  <Text style={styles.cardValue}>{booking.time || 'N/A'}</Text>
                </View>
                <View style={styles.cardItem}>
                  <Text style={styles.cardLabel}>Destination:</Text>
                  <Text style={styles.cardValue}>{booking.destination || 'N/A'}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleCancelBooking(booking._id, 'vehicle')}
                >
                  <Text style={styles.cancelButtonText}>Cancel Rental</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
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
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#D1A7F7',
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserProfilePage;