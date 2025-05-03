import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { ImageBackground } from 'react-native';

// Component code below
const CancelBookingPage = () => {
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [bookingType, setBookingType] = useState('');

  const handleCancel = async () => {
    if (!bookingId.trim()) {
      Alert.alert("Error", `Please enter a valid ${bookingType === 'hotel' ? 'Reservation' : 'Booking'} ID.`);
      return;
    }

    setLoading(true);

    let endpoint = '';
    switch (bookingType) {
      case 'hotel':
        endpoint = `http://192.168.1.7:7798/cancel-hotel-booking/${bookingId}`;
        break;
      case 'lounge':
        endpoint = `http://192.168.1.7:7798/cancel-lounge-booking/${bookingId}`;
        break;
      case 'rental':
        endpoint = `http://192.168.1.7:7798/cancel-vehicle-booking/${bookingId}`;
        break;
      case 'flight':
        endpoint = `http://192.168.1.7:7798/cancel-flight-booking/${bookingId}`;
        break;
      default:
        Alert.alert("Error", "Invalid booking type.");
        setLoading(false);
        return;
    }

    try {
      const response = await axios.delete(endpoint);
      Alert.alert("✅ Cancelled", response.data.message);
      setBookingId('');
    } catch (err) {
      console.log(err);  
      const errorMsg = err.response?.data?.error || "Failed to cancel booking.";
      Alert.alert("❌ Error", errorMsg);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/airplane.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Cancel Your Booking</Text>

          <View style={styles.bookingTypeContainer}>
            <Text style={styles.label}>Select Booking Type</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
              <Text style={{ color: bookingType ? '#000' : '#fff' }}>
                {bookingType
                  ? `${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} Booking`
                  : 'Tap to select booking type'}
              </Text>
            </TouchableOpacity>
          </View>
          <Modal visible={showPicker} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.label}>Select Booking Type</Text>
                <View style={styles.optionList}>
                  {[
                    { label: 'Hotel', value: 'hotel' },
                    { label: 'Lounge', value: 'lounge' },
                    { label: 'Rental', value: 'rental' },
                    { label: 'Flight', value: 'flight' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.optionItem}
                      onPress={() => {
                        setBookingType(option.value);
                        setShowPicker(false);
                      }}
                    >
                      <Text style={styles.optionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.modalCloseButton}>
                  <Text style={{ color: '#5D3FD3', fontWeight: 'bold' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {bookingType !== '' && (
            <>
              <Text style={styles.label}>
                Enter Your {bookingType === 'hotel' ? 'Reservation' : 'Booking'} ID
              </Text>
              <TextInput
                style={styles.input}
                placeholder={
                  bookingType === 'hotel'
                    ? "e.g., 65123abc456def"
                    : bookingType === 'flight'
                    ? "e.g., FLT123456"
                    : "e.g., ABC123456789"
                }
                value={bookingId}
                onChangeText={setBookingId}
                autoCapitalize="none"
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.disabled]}
            onPress={handleCancel}
            disabled={loading}
          >
            {bookingType === 'flight' ? (
              <Text style={{ fontSize: 20, marginRight: 8 }}></Text>
            ) : (
              <FontAwesome name={bookingType === 'hotel' ? 'hotel' : bookingType === 'lounge' ? 'chair' : 'car'} size={20} color="#fff" style={{ marginRight: 8 }} />
            )}
            <Text style={styles.buttonText}>
              {loading
                ? "Cancelling..."
                : bookingType
                ? `Cancel ${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} Booking`
                : "Cancel"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    width: '100%',
    backgroundColor: 'rgba(162, 90, 255, 0.5)',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingTypeContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 10,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#C7B8EC',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#D6B4FC',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionList: {
    width: '100%',
    backgroundColor: '#E5D4FF',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#D1B3FF',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#5D3FD3',
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#A26AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CancelBookingPage;
