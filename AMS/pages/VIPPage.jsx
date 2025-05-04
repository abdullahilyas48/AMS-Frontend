import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import TimeSelector from '../components/TimeSelector';
import DateSelector from '../components/DateSelector';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BookLounge = () => {
  const { userData, token } = useAuth();
  const navigation = useNavigation();
  const [lounges, setLounges] = useState([]);
  const [selectedLounge, setSelectedLounge] = useState('');
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchLounges = async () => {
      try {
        const response = await axios.get('http://192.168.100.18:7798/lounges', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLounges(response.data);
      } catch (error) {
        console.error('Error fetching lounges:', error);
        Alert.alert('Error', 'Failed to load lounges');
      }
    };
    fetchLounges();
  }, [token]);

  const handleBooking = async () => {
    if (!selectedLounge || !bookingDate || !bookingTime) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://192.168.100.18:7798/book-lounge',
        {
          userId: userData._id,
          loungeId: selectedLounge,
          date: bookingDate.toISOString().split('T')[0],
          time: bookingTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { booking } = response.data;
      const loungeName = lounges.find((l) => l._id === booking.loungeId)?.name || 'Selected Lounge';

      Alert.alert(
        'Success',
        `Lounge booked successfully!\n\n` +
        `Lounge: ${loungeName}\n` +
        `Date: ${booking.date}\n` +
        `Time: ${booking.time}\n` +
        `User ID: ${booking.userId}\n` +
        `Lounge ID: ${booking.loungeId}\n` +
        `Booking ID: ${booking._id}\n` +
        `Created At: ${new Date(booking.createdAt).toLocaleString()}`
      );

    } catch (error) {
      console.error('Booking failed:', error);
      Alert.alert('Error', 'Failed to book the lounge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Add ImageBackground for header */}
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
        <Text style={styles.title}>Book a Lounge</Text>

        <Text style={styles.inputHeading}>Choose a Lounge</Text>
        <TouchableOpacity style={styles.inputField} onPress={() => setIsDropdownVisible(prev => !prev)}>
  <Text style={styles.inputText}>
    {selectedLounge
      ? lounges.find((l) => l._id === selectedLounge)?.name
      : 'Select Lounge'}
  </Text>
  <Ionicons name="chevron-down" size={20} color="grey" />
</TouchableOpacity>


{isDropdownVisible && (
  <View style={styles.dropdown}>
    {lounges.map((item) => (
      <TouchableOpacity
        key={item._id}
        style={styles.modalItem}
        onPress={() => {
          setSelectedLounge(item._id);
          setIsDropdownVisible(false);
        }}
      >
        <Text style={styles.modalText}>{item.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}


        <DateSelector label="Booking Date" date={bookingDate} onDateChange={setBookingDate} />
        <TimeSelector label="Booking Time" time={bookingTime} onTimeChange={setBookingTime} />

        <PrimaryButton
          label={loading ? 'Booking...' : 'Book Lounge'}
          onPress={handleBooking}
        />
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
    width: '107%',
    height: 300,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  backButton: {
    marginTop: 60,
    right: -10,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginHorizontal: 10,
    marginTop: -18,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    height: 680,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputHeading: {
    fontSize: 14,  // Smaller font size
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 12,
    color: 'black', // Changed to black
  },
  inputField: {
    backgroundColor: '#E0D3F5',
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    color: '#000',  
  },
  dropdown: {
    backgroundColor: '#E0D3F5',  // Keep background color as you wanted
    borderRadius: 8,
    marginBottom: 14,
    maxHeight: 150, // You can adjust the height if necessary
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    shadowColor: '#000',  // Adding shadow for better depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  modalItem: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingLeft: 15,  // Added padding for better text spacing
  },
  
  modalText: {
    color: '#000',  // Set the text color to black for better visibility
    fontSize: 16,  // Slightly increase font size for better readability
  },
  
});

export default BookLounge;
