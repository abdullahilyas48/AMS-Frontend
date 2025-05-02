import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function StaffDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('AdminDashboard')} // <-- Changed here
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Staff Dashboard</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Staff Management</Text>
        <Text style={styles.subtitle}>Manage your team and schedules</Text>
        
        {/* Centered Card Row */}
        <View style={styles.centeredCardRow}>
          {/* Staff Schedule Card */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('StaffSchedule')}
          >
            <View style={styles.cardIconContainer}>
              <Ionicons name="calendar-outline" size={28} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Staff Schedule</Text>
          </TouchableOpacity>

          {/* Assign Duties Card */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DutyAssignment')}
          >
            <View style={styles.cardIconContainer}>
              <FontAwesome5 name="user-check" size={24} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Assign Duties</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#8d56aa',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: 20
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  centeredCardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 50,
  },
  card: {
    width: width * 0.4,
    height: 160,
    borderRadius: 15,
    padding: 20,
    backgroundColor: '#9c64b5',
    shadowColor: '#8d56aa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
