import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  Dimensions, FlatList, ImageBackground
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function FlightInformation({ navigation }) {
  const [flights, setFlights] = useState([]);
  const [flightNumber, setFlightNumber] = useState('');
  const [date, setDate] = useState('');

  const fetchFlights = async () => {
    try {
      const params = {};
      if (date) params.date = date;
      if (flightNumber) params.flightNumber = flightNumber;

      const res = await axios.get('http://192.168.1.7:7798/flights', { params });
      setFlights(res.data.message ? [] : res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [flightNumber, date]);

  const renderFlightCard = ({ item }) => (
    <View style={styles.flightCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.flightNumber}>{item.flightNumber}</Text>
        <Text style={styles.airline}>{item.airline}</Text>
      </View>
      
      <View style={styles.routeContainer}>
        <View style={styles.route}>
          <Text style={styles.routeTime}>{item.time}</Text>
          <Text style={styles.routeAirport}>{item.from}</Text>
        </View>
        
        <View style={styles.durationContainer}>
          <View style={styles.durationLine} />
          <Text style={styles.durationText}>Flight Duration</Text>
        </View>
        
        <View style={styles.route}>
          <Text style={styles.routeTime}>{item.arrivalTime}</Text>
          <Text style={styles.routeAirport}>{item.to}</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Class:</Text>
          <Text style={styles.detailValue}>{item.flightClass}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price:</Text>
          <Text style={styles.detailValue}>${item.price}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Luggage:</Text>
          <Text style={styles.detailValue}>{item.maxLuggageWeight} kg</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Seats:</Text>
          <Text style={styles.detailValue}>{item.seatsAvailable}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/AdminBg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.overlayBackground} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Flight Information</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Search Filters */}
          <View style={styles.filterContainer}>
            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              placeholderTextColor="#555"
            />
            <TextInput
              style={styles.input}
              placeholder="Flight Number"
              value={flightNumber}
              onChangeText={setFlightNumber}
              placeholderTextColor="#555"
            />
          </View>

          {/* Flight Cards */}
          {flights.length === 0 ? (
            <View style={styles.noFlightsContainer}>
              <Text style={styles.noFlights}>No flights found</Text>
            </View>
          ) : (
            <FlatList
              data={flights}
              renderItem={renderFlightCard}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.listContent}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    position: 'relative',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // darker background for contrast
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8d56aa',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerPlaceholder: {
    width: 30,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  filterContainer: {
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 10,
    padding: 12,
    flex: 1,
    marginHorizontal: 5,
    color: '#000',
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  flightCard: {
    width: width - 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginRight: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 10,
  },
  flightNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  airline: {
    fontSize: 16,
    color: '#f0e6f6',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  route: {
    alignItems: 'center',
    width: width * 0.3,
  },
  routeTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  routeAirport: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 5,
  },
  durationContainer: {
    alignItems: 'center',
  },
  durationLine: {
    height: 1,
    width: width * 0.2,
    backgroundColor: '#e0c6f5',
    marginVertical: 5,
  },
  durationText: {
    fontSize: 12,
    color: '#e0c6f5',
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#e0d6ec',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 14,
    color: '#ffffff',
  },
  noFlightsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFlights: {
    fontSize: 16,
    color: '#ccc',
  },
});
