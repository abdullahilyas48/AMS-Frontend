import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  TouchableOpacity, Dimensions, ActivityIndicator, ImageBackground
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const PassengerDetails = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [flightNumber, setFlightNumber] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPassengerDetails = async () => {
    setError(null);
    setLoading(true);
    try {
      const params = [];
      if (flightNumber.trim()) params.push(`flightNumber=${flightNumber.trim()}`);
      if (date) params.push(`bookedAt=${date.toISOString().split('T')[0]}`);
      const query = params.join('&');

      const response = await axios.get(`http://192.168.1.7:7798/passenger-details?${query}`);
      if (Array.isArray(response.data)) {
        setPassengers(response.data);
        if (response.data.length === 0) setError('No passengers found for the selected criteria.');
      } else {
        setPassengers([]);
        setError('Unexpected response format');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch passenger details');
      setPassengers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengerDetails();
  }, [date, flightNumber]);

  const formatDateTime = (str) => {
    if (!str) return 'N/A';
    const d = new Date(str);
    return isNaN(d) ? 'N/A' : `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  const renderPassengerCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.passengerName || 'Unnamed'}</Text>
        <Text style={styles.seat}>{item.seatNumber || 'N/A'}</Text>
      </View>
      <View style={styles.routeRow}>
        <View style={styles.routeBox}>
          <Text style={styles.routeTime}>{item.departure?.time || 'N/A'}</Text>
          <Text style={styles.routePlace}>{item.departure?.location || 'N/A'}</Text>
        </View>
        <View style={styles.iconBox}>
          <Ionicons name="airplane" size={20} color="#ffffffcc" />
        </View>
        <View style={styles.routeBox}>
          <Text style={styles.routeTime}>{item.arrival?.time || 'N/A'}</Text>
          <Text style={styles.routePlace}>{item.arrival?.location || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );

  const clearFilters = () => {
    setDate(new Date());
    setFlightNumber('');
  };

  return (
    <ImageBackground
  source={require('../assets/AdminBg.png')}
  style={styles.container}
  resizeMode="cover"
>
  <View style={styles.overlay}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Passenger Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterInput} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={16} color="#fff" />
          <Text style={styles.filterText}>{date.toDateString()}</Text>
        </TouchableOpacity>
        <View style={styles.filterInput}>
          <Ionicons name="search" size={16} color="#fff" />
          <TextInput
            placeholder="Flight No."
            value={flightNumber}
            onChangeText={setFlightNumber}
            style={styles.filterTextInput}
            placeholderTextColor="#ccc"
          />
        </View>
        <TouchableOpacity onPress={clearFilters} style={styles.clearBtn}>
          <Ionicons name="close-circle" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={passengers}
            keyExtractor={(item) => item._id || Math.random().toString()}
            renderItem={renderPassengerCard}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        )}
      </View>
      </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#7e57c2', // updated to a readable purple
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: { padding: 5 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  filterInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: width * 0.38,
  },
  filterText: { marginLeft: 6, color: '#fff', fontSize: 14 },
  filterTextInput: {
    marginLeft: 6,
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  clearBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#ffcccc',
    fontSize: 16,
    marginTop: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // less transparent
    borderRadius: 15,
    marginBottom: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 8,
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  seat: {
    fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    color: '#fff',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  routeBox: {
    alignItems: 'center',
    width: width * 0.35,
  },
  routeTime: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  routePlace: {
    fontSize: 14,
    color: '#eee',
    marginTop: 4,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // adjust the opacity to your liking (0.3–0.5 is good)
  },
  
  iconBox: { width: width * 0.1, alignItems: 'center' },
});

export default PassengerDetails;
