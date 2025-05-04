import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function StaffDashboard({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/AdminBg.png')} // ✅ Updated here
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('AdminDashboard')}
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

          <View style={styles.centeredCardRow}>
            {/* Staff Schedule */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('StaffSchedule')}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons name="calendar-outline" size={28} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Staff Schedule</Text>
            </TouchableOpacity>

            {/* Assign Duties */}
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
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(30, 0, 60, 0.7)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
    paddingBottom: 40,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
