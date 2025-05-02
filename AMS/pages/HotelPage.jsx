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
      const response = await axios.get(`http://192.168.100.18:7798/hotel-rooms?minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`);
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
    console.log("Current User Data:", userData);

    if (!selectedRoom) {
      Alert.alert("Please select a room to book.");
      return;
    }

    if (!isAuthenticated || !userData || !userData.email) {
      Alert.alert("Error", "You must be logged in to book a room.");
      return;
    }

    try {
      const payload = {
        userEmail: userData.email,
        hotelName: selectedRoom.hotelName,
        roomType: selectedRoom.roomType,
        date: date.toISOString().split('T')[0],
      };

      const response = await axios.post('http://192.168.100.18:7798/hotel-book', payload);
      Alert.alert("Success", response.data.message);
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
             style={{ marginTop: 40 }}  // Adjust this value as needed
         />
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
    borderRadius: 15,
    elevation: 4,
    width: '90%',
    minHeight: 600,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  blackText: {
    color: '#000',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#E0D3F5',
  },
  dropdownList: {
    backgroundColor: '#E0D3F5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default HotelBookingPage;
