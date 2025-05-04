import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Animated,
  Easing,
  ImageBackground
} from 'react-native';
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
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

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
        <ActivityIndicator size="large" color="#5E35B1" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#5E35B1" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </Animated.View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
            <Ionicons name="warning-outline" size={24} color="#D32F2F" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={handleRetry}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View style={[styles.profileCard, { opacity: fadeAnim }]}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={100} color="#5E35B1" />
          </View>
          <Text style={styles.welcomeText}>Welcome back, {userData?.name || 'User'}!</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#5E35B1" />
              <Text style={styles.infoText}>{userData?.email || 'N/A'}</Text>
            </View>
          </View>
        </Animated.View>


         {/* Flight Bookings Section */}
         <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="airplane-outline" size={24} color="#5E35B1" />
            <Text style={styles.sectionTitle}>Flight Bookings</Text>
          </View>
          
          {loadingBookings.flights ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#5E35B1" />
            </View>
          ) : flightBookings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="airplane-outline" size={32} color="#B39DDB" />
              <Text style={styles.noBookingsText}>No active flight bookings</Text>
            </View>
          ) : (
            flightBookings.map((booking) => (
              <View key={booking._id} style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {booking.flightId?.airline || 'Flight'} {booking.flightId?.flightNumber || ''}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: '#1E88E5' }]}>
                    <Text style={styles.statusText}>Confirmed</Text>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.cardItem}>
                    <Ionicons name="swap-horizontal-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Route: </Text>
                    <Text style={styles.cardValue}>
                      {booking.flightId?.from || 'N/A'} → {booking.flightId?.to || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="calendar-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Date: </Text>
                    <Text style={styles.cardValue}>
                      {new Date(booking.flightId?.date).toLocaleDateString() || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="time-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Time: </Text>
                    <Text style={styles.cardValue}>
                      {booking.flightId?.time || 'N/A'} - {booking.flightId?.arrivalTime || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="business-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Class: </Text>
                    <Text style={styles.cardValue}>{booking.flightId?.flightClass || 'N/A'}</Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="person-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Seat: </Text>
                    <Text style={styles.cardValue}>{booking.seatNumber || 'N/A'}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#B88BE0' }]}
                  onPress={() => handleCancelBooking(booking._id, 'flight')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionButtonText}>Cancel Flight</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </Animated.View>

        {/* Parking Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="car-sport-outline" size={24} color="#5E35B1" />
            <Text style={styles.sectionTitle}>Parking Reservations</Text>
          </View>
          
          {loadingBookings.parking ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#5E35B1" />
            </View>
          ) : parkingBookings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="car-sport-outline" size={32} color="#B39DDB" />
              <Text style={styles.noBookingsText}>No active parking bookings</Text>
            </View>
          ) : (
            parkingBookings.map((booking) => (
              <View key={booking._id} style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Parking Reservation</Text>
                  <View style={[styles.statusBadge, { backgroundColor: '#43A047' }]}>
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.cardItem}>
                    <Ionicons name="location-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Spot: </Text>
                    <Text style={styles.cardValue}>
                      {booking.spot ? `${booking.spot.terminalLocation}${booking.spot.number}` : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="calendar-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Date: </Text>
                    <Text style={styles.cardValue}>
                      {new Date(booking.reservationDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="time-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Time: </Text>
                    <Text style={styles.cardValue}>
                      {booking.startTime} - {booking.endTime}
                    </Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="car-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Vehicle: </Text>
                    <Text style={styles.cardValue}>{booking.vehicleType}</Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="document-text-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>License: </Text>
                    <Text style={styles.cardValue}>{booking.licensePlate}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#B88BE0' }]}
                  onPress={() => handleCancelBooking(booking._id, 'parking')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionButtonText}>Cancel Reservation</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </Animated.View>


        {/* Hotel Bookings Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bed-outline" size={24} color="#5E35B1" />
            <Text style={styles.sectionTitle}>Hotel Bookings</Text>
          </View>
          
          {loadingBookings.hotels ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#5E35B1" />
            </View>
          ) : hotelBookings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="bed-outline" size={32} color="#B39DDB" />
              <Text style={styles.noBookingsText}>No active hotel bookings</Text>
            </View>
          ) : (
            hotelBookings.map((booking) => (
              <View key={booking._id} style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{booking.hotelName || 'Hotel Booking'}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: '#FB8C00' }]}>
                    <Text style={styles.statusText}>Booked</Text>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.cardItem}>
                    <Ionicons name="home-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Room: </Text>
                    <Text style={styles.cardValue}>{booking.roomType || 'N/A'}</Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="calendar-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Check-in: </Text>
                    <Text style={styles.cardValue}>
                      {new Date(booking.date).toLocaleDateString() || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="cash-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Price: </Text>
                    <Text style={styles.cardValue}>${booking.price || 'N/A'}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#B88BE0' }]}
                  onPress={() => handleCancelBooking(booking._id, 'hotel')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </Animated.View>

        {/* Lounge Bookings Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cafe-outline" size={24} color="#5E35B1" />
            <Text style={styles.sectionTitle}>Lounge Bookings</Text>
          </View>
          
          {loadingBookings.lounges ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#5E35B1" />
            </View>
          ) : loungeBookings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="cafe-outline" size={32} color="#B39DDB" />
              <Text style={styles.noBookingsText}>No active lounge bookings</Text>
            </View>
          ) : (
            loungeBookings.map((booking) => (
              <View key={booking._id} style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {booking.loungeId?.name || 'Lounge Booking'}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: '#8E24AA' }]}>
                    <Text style={styles.statusText}>Reserved</Text>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.cardItem}>
                    <Ionicons name="calendar-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Date: </Text>
                    <Text style={styles.cardValue}>
                      {new Date(booking.date).toLocaleDateString() || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="time-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Time: </Text>
                    <Text style={styles.cardValue}>{booking.time || 'N/A'}</Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="people-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Guests: </Text>
                    <Text style={styles.cardValue}>{booking.guests || '1'}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#B88BE0' }]}
                  onPress={() => handleCancelBooking(booking._id, 'lounge')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </Animated.View>

        {/* Vehicle Rentals Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="car-outline" size={24} color="#5E35B1" />
            <Text style={styles.sectionTitle}>Vehicle Rentals</Text>
          </View>
          
          {loadingBookings.vehicles ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#5E35B1" />
            </View>
          ) : vehicleBookings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="car-outline" size={32} color="#B39DDB" />
              <Text style={styles.noBookingsText}>No active vehicle rentals</Text>
            </View>
          ) : (
            vehicleBookings.map((booking) => (
              <View key={booking._id} style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {booking.vehicleId?.name || 'Vehicle Rental'} ({booking.vehicleId?.type || 'N/A'})
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: '#F4511E' }]}>
                    <Text style={styles.statusText}>Booked</Text>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.cardItem}>
                    <Ionicons name="calendar-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Date: </Text>
                    <Text style={styles.cardValue}>
                      {new Date(booking.date).toLocaleDateString() || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="time-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Time: </Text>
                    <Text style={styles.cardValue}>{booking.time || 'N/A'}</Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="navigate-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Destination: </Text>
                    <Text style={styles.cardValue}>{booking.destination || 'N/A'}</Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Ionicons name="cash-outline" size={16} color="#5E35B1" />
                    <Text style={styles.cardLabel}>Price: </Text>
                    <Text style={styles.cardValue}>${booking.price || 'N/A'}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#B88BE0' }]}
                  onPress={() => handleCancelBooking(booking._id, 'vehicle')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionButtonText}>Cancel Rental</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </Animated.View>
        
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EAFD',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    color: '#5E35B1',
    marginTop: 15,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#D6C4F0',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE7F6',
    elevation: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#5E35B1',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5E35B1',
    marginLeft: 20,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE7F6',
  },
  avatarContainer: {
    backgroundColor: '#EDE7F6',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4527A0',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE7F6',
  },
  infoText: {
    fontSize: 16,
    color: '#4527A0',
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5E35B1',
    marginLeft: 12,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#EDE7F6',
  },
  
  loadingCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE7F6',
    borderStyle: 'dashed',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE7F6',
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4527A0',
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  noBookingsText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF9A9A',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  errorText: {
    color: '#D32F2F',
    marginHorizontal: 10,
    marginVertical: 5,
    textAlign: 'center',
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#5E35B1',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserProfilePage;