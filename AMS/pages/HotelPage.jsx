import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateSelector from '../components/DateSelector'; 
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';
import PriceRangeSelector from '../components/PriceRangeSelector';

const BookHotelRoom = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [hotelName, setHotelName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [roomOptions, setRoomOptions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  
  const userId = '6635f9b7e7c6e62cd7e02ab0'; // Replace with real logged-in userId

  // Fetch available rooms based on price range
  const fetchRooms = async () => {
    if (selectedDate) {
      try {
        const response = await axios.get(`http://192.168.100.18:7798/hotel-rooms?maxPrice=${priceRange[1]}&minPrice=${priceRange[0]}`);
        setRoomOptions(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        Alert.alert('Error', 'Unable to fetch available rooms.');
      }
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [priceRange, selectedDate]);  // Trigger fetching when date or price range changes

  const handleBooking = async () => {
    if (!selectedDate || !hotelName || !roomType) {
      alert('Please fill all the fields before submitting!');
      return;
    }

    const bookingData = {
      userId,
      hotelName,
      roomType,
      date: selectedDate,
    };

    try {
      const response = await axios.post('http://192.168.100.18:7798/hotel-book', bookingData);
      alert('Booking successful!\n' + JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Booking failed:', error.response ? error.response.data : error.message);
      Alert.alert('Booking Failed', 'Please try again later.');
    }
  };

  const selectRoom = (room) => {
    setHotelName(room.hotelName);
    setRoomType(room.roomType);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Hotel Room</Text>

      {/* Date Selection */}
      <DateSelector
        label="Select Date"
        date={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Price Range Selection */}
      <PriceRangeSelector
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {/* Room Selection */}
      <Text style={styles.inputHeading}>Choose your Room</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputField}>
        <Text style={styles.inputText}>
          {hotelName ? `${hotelName} - ${roomType}` : 'Select Room'}
        </Text>
        <Ionicons name="bed" size={20} color="#888" />
      </TouchableOpacity>

      {/* Modal for Room Options */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={roomOptions}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectRoom(item)} style={styles.modalItem}>
                  <Text style={styles.modalText}>
                    {`${item.hotelName} - ${item.roomType} - $${item.price}`}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <PrimaryButton label="Book Now" onPress={handleBooking} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8BFE8',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  inputHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    marginTop: 15,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E9D5FF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1c1e0',
    marginBottom: 20,
  },
  inputText: {
    fontSize: 16,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#D8BFE8',
    width: 300,
    borderRadius: 5,
    paddingVertical: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalText: {
    fontSize: 18,
    color: '#000',
  },
});

export default BookHotelRoom;
