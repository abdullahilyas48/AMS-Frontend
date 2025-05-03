import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PriceRangeSelector from '../components/PriceRangeSelector';
import DateSelector from '../components/DateSelector';
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const HotelBookingPage = () => {
  const { isAuthenticated, userData } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [date, setDate] = useState(new Date());
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    fetchAvailableRooms();
  }, [priceRange]);

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get(`http://192.168.1.7:7798/hotel-rooms?minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`);
      setRooms(response.data);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch hotel rooms.");
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

      fetchAvailableRooms();
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      Alert.alert("Booking Failed", error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        {dropdownVisible && (
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
    flexGrow: 1,
    backgroundColor: '#E5D4ED',
    paddingVertical: 30,
    alignItems: 'center',
  },
  container: {
    marginTop: 150,
    padding: 20,
    backgroundColor: '#F4E8FF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '90%',
    minHeight: 500,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5D3FD3',
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    backgroundColor: '#F4F0FB',
    borderColor: '#C7B8EC',
    borderWidth: 1,
  },
  dropdownList: {
    backgroundColor: '#F4F0FB',
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
});

export default HotelBookingPage;
