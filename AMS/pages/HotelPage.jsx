import React, { useEffect, useState } from 'react';   
import { View, Text, Alert, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PriceRangeSelector from '../components/PriceRangeSelector';
import DateSelector from '../components/DateSelector';
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

const HotelBookingPage = () => {
  const { isAuthenticated, userData } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [date, setDate] = useState(new Date());
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // Track loading state
  const [error, setError] = useState(null);  // Track errors
  const navigation = useNavigation(); // <-- this is missing


  useEffect(() => {
    fetchAvailableRooms();
  }, [priceRange]);

  const fetchAvailableRooms = async () => {
    setIsLoading(true);
    setError(null);  // Clear previous errors if any
    try {
      const response = await axios.get(`http://192.168.1.7:7798/hotel-rooms?minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`);
      setRooms(response.data);
    } catch (err) {
      setError('Failed to fetch hotel rooms. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setDropdownVisible(false);
  };

  const handleBooking = async () => {
    if (!selectedRoom) {
      Alert.alert("Please select a room to book.");
      return;
    }

    if (!isAuthenticated || !userData || !userData.email) {
      Alert.alert("Error", "You must be logged in to book a room.");
      return;
    }

    const userID = userData?._id || userData?.id;

    try {
      const payload = {
        userId: userID,
        userEmail: userData.email,
        hotelName: selectedRoom.hotelName,
        roomType: selectedRoom.roomType,
        date: date.toISOString().split('T')[0],
      };

      const response = await axios.post('http://192.168.1.7:7798/hotel-book', payload);
      const booking = response.data.booking;

      Alert.alert(
        "✅ Booking Successful!",
        `Reservation ID: ${booking._id}\nHotel: ${booking.hotelName}\nRoom Type: ${booking.roomType}\nPrice: Rs. ${booking.price}\nDate: ${booking.date}`
      );

      fetchAvailableRooms();  // Refresh available rooms after booking
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      Alert.alert("Booking Failed", error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground
        source={require('../assets/airplane.png')}
        style={[styles.headerImage, { marginTop: -30 }]}
        imageStyle={{ resizeMode: 'cover', borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.container}>
        <Text style={styles.heading}>Book a Hotel Room</Text>

        <PriceRangeSelector
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        <DateSelector
          label="Select Booking Date"
          date={date}
          onDateChange={setDate}
          labelStyle={styles.label}
        />

        <Text style={styles.label}>Select a Room</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={styles.blackText}>
            {selectedRoom
              ? `${selectedRoom.hotelName} - ${selectedRoom.roomType} (Rs. ${selectedRoom.price})`
              : 'Tap to select a room'}
          </Text>
          <FontAwesome name={dropdownVisible ? "chevron-up" : "chevron-down"} size={16} color="#000" />
        </TouchableOpacity>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4B0082" />
            <Text style={styles.blackText}>Loading rooms...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.blackText}>{error}</Text>
            <TouchableOpacity onPress={fetchAvailableRooms} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          dropdownVisible && (
            <View style={styles.dropdownList}>
              {rooms.length === 0 ? (
                <Text style={styles.blackText}>No rooms available in this price range.</Text>
              ) : (
                rooms.map((room) => (
                  <TouchableOpacity
                    key={room._id}
                    style={styles.dropdownItem}
                    onPress={() => handleRoomSelect(room)}
                  >
                    <Text style={styles.blackText}>
                      {`${room.hotelName} - ${room.roomType} (Rs. ${room.price})`}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )
        )}

        <PrimaryButton
          label="Book Selected Room"
          onPress={handleBooking}
          disabled={!selectedRoom}
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
    height: 300,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
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
    height: 800,
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
    marginBottom: 20,
  },
  dropdownList: {
    backgroundColor: '#E0D3F5',
    borderWidth: 1,
    borderColor: '#C7B8EC',
    borderRadius: 10,
    marginTop: 5,
    paddingHorizontal: 10,
    maxHeight: 180,
  },
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D6CCF1',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  retryButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HotelBookingPage;
