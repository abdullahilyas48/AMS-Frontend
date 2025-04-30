import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfilePage = ({ navigation }) => {
  const { userData, setAuthState } = useAuth(); // Correct usage
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://192.168.1.113:7798/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      console.log('User details:', data);

      // ✅ Correctly update userData using setAuthState
      setAuthState(prev => ({
        ...prev,
        userData: data
      }));
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'UserHome' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={80} color="#D1A7F7" />
          </View>
          <Text style={styles.welcomeText}>Welcome back, {userData?.name || 'User'}!</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color="#D1A7F7" />
              <Text style={styles.infoText}>{userData?.email || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="ribbon-outline" size={18} color="#D1A7F7" />
              <Text style={styles.infoText}>Status: {userData?.status || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="airplane-outline" size={18} color="#D1A7F7" />
              <Text style={styles.infoText}>Air Miles: {userData?.airMiles || '0'}</Text>
            </View>
          </View>
        </View>

        {renderSection('Active Bookings', [
          'Airline:',
          'Flight Number:',
          'Departure:',
          'Destination:',
          'Seat:',
          'Class:'
        ])}

        {renderSection('Rentals', [
          'Time:',
          'Date:',
          'Destination:',
          'Vehicle:'
        ])}

        {renderSection('Hotels', [
          'Hotel Name:',
          'Date:',
          'Room Type:'
        ])}

        {renderSection('Lounges', [
          'Date:',
          'Time:',
          'Lounge Type:'
        ])}

        {renderSection('Airport Parking', [
          'Date:',
          'Time:',
          'Spot Number:',
          'Vehicle Type:',
          'License Number:'
        ])}
      </ScrollView>
    </View>
  );

  function renderSection(title, items) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>
          {items.map((item, index) => (
            <View key={index} style={styles.cardItem}>
              <Text style={styles.cardLabel}>{item}</Text>
              <Text style={styles.cardValue}>-</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#D1A7F7',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    color: 'white',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'center',
  },
  avatarContainer: {
    backgroundColor: '#F1D9FF',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D1A7F7',
    marginBottom: 10,
    marginLeft: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  cardLabel: {
    fontSize: 15,
    color: '#D1A7F7',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 15,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfilePage;
