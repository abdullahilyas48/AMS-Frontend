import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const PassengerDetails = () => {
  const [filterType, setFilterType] = useState('date');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [flightNumber, setFlightNumber] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPassengerDetails = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const query = filterType === 'date' 
        ? `date=${formattedDate}` 
        : `flightNumber=${flightNumber.trim()}`;
      
      const response = await axios.get(`http://192.168.1.7:7798/passenger-details?${query}`);
      
      if (Array.isArray(response.data)) {
        if (response.data.length > 0) {
          setPassengers(response.data);
        } else {
          setPassengers([]);
          setError('No passengers found');
        }
      } else if (response.data.message) {
        setPassengers([]);
        setError(response.data.message);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to fetch passenger details');
      setPassengers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((filterType === 'date') || (filterType === 'flightNumber' && flightNumber.trim())) {
      fetchPassengerDetails();
    }
  }, [filterType, date, flightNumber]);

  const renderPassenger = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.passengerName || 'N/A'}</Text>
      <Text style={styles.cell}>
        {item.departure?.location || 'N/A'}, {item.departure?.time || 'N/A'}
      </Text>
      <Text style={styles.cell}>
        {item.arrival?.location || 'N/A'}, {item.arrival?.time || 'N/A'}
      </Text>
      <Text style={styles.cell}>{item.seatNumber || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Details</Text>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.button, filterType === 'date' && styles.activeButton]}
          onPress={() => setFilterType('date')}
        >
          <Text style={styles.buttonText}>By Date</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, filterType === 'flightNumber' && styles.activeButton]}
          onPress={() => setFilterType('flightNumber')}
        >
          <Text style={styles.buttonText}>By Flight Number</Text>
        </TouchableOpacity>
      </View>

      {filterType === 'date' ? (
        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)} 
          style={styles.datePickerButton}
        >
          <Text>Select Date: {date.toDateString()}</Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter Flight Number"
          value={flightNumber}
          onChangeText={setFlightNumber}
          autoCapitalize="characters"
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Passenger</Text>
            <Text style={styles.headerCell}>Departure</Text>
            <Text style={styles.headerCell}>Arrival</Text>
            <Text style={styles.headerCell}>Seat</Text>
          </View>

          <FlatList
            data={passengers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderPassenger}
            ListEmptyComponent={
              !loading && <Text style={styles.emptyText}>No passengers found</Text>
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
    color: '#333',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#6200ee',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  datePickerButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    marginBottom: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default PassengerDetails;