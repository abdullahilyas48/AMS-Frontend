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
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import TimeSelector from '../components/TimeSelector';
import DateSelector from '../components/DateSelector';
import PrimaryButton from '../components/PrimaryButton';

const BookLounge = () => {
  const { userData, token } = useAuth();
  const [lounges, setLounges] = useState([]);
  const [selectedLounge, setSelectedLounge] = useState('');
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchLounges = async () => {
      try {
        const response = await axios.get('http://192.168.1.7:7798/lounges', {
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
        'http://192.168.1.7:7798/book-lounge',
        {
          userId: userData.id,
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
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Book a Lounge</Text>

        <Text style={styles.inputHeading}>Choose a Lounge</Text>
        <TouchableOpacity style={styles.inputField} onPress={() => setIsDropdownVisible(true)}>
          <Text style={styles.inputText}>
            {selectedLounge
              ? lounges.find((l) => l._id === selectedLounge)?.name
              : 'Select Lounge'}
          </Text>
        </TouchableOpacity>

        <Modal
          transparent
          animationType="fade"
          visible={isDropdownVisible}
          onRequestClose={() => setIsDropdownVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <FlatList
                    data={lounges}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          setSelectedLounge(item._id);
                          setIsDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.modalText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

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
  scrollContainer: { flexGrow: 1, backgroundColor: '#E5D4ED' },
  contentContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 },
  container: {
    padding: 20,
    backgroundColor: '#F4E8FF',
    margin: 20,
    borderRadius: 15,
    elevation: 4,
    width: '90%',

  
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
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
    color: '#000',
  },
  inputField: {
    backgroundColor: '#E0D3F5',
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#E0D3F5',
    borderRadius: 10,
    width: '80%',
    maxHeight: 250,
    padding: 15,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  modalText: {
    color: '#000',
  },
});

export default BookLounge;
