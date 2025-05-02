import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import LogoutModal from '../components/LogoutModal';

const { width } = Dimensions.get('window');

const AdminDashboardPage = ({ navigation }) => {
  const [logoutVisible, setLogoutVisible] = useState(false);

  const handleLogoutConfirm = () => {
    setLogoutVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const DashboardCard = ({ icon, title, onPress, IconComponent = FontAwesome5 }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.cardIconContainer}>
          <IconComponent name={icon} size={24} color="#fff" />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerButtonPlaceholder} />
        <Text style={styles.headerText}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => setLogoutVisible(true)} style={styles.headerButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Welcome back, Admin</Text>
        <Text style={styles.subtitle}>Manage your airline operations</Text>
        
        {/* Top Row - Small Cards */}
        <View style={styles.cardRow}>
          <DashboardCard 
            icon="plane" 
            title="Flight Information" 
            onPress={() => navigation.navigate('FlightInformation')}
          />
          <DashboardCard 
            icon="users" 
            title="Passenger Details" 
            onPress={() => navigation.navigate('PassengerDetails')}
          />
        </View>
        
        {/* Full-width Staff Management Card */}
        <View style={styles.fullWidthCard}>
          <TouchableOpacity 
            style={[styles.card, styles.staffCard]} 
            onPress={() => navigation.navigate('StaffDashboard')}
            activeOpacity={0.8}
          >
            <View style={styles.staffCardContent}>
              <View style={styles.staffIconContainer}>
                <MaterialIcons name="people-alt" size={32} color="#fff" />
              </View>
              <View style={styles.staffTextContainer}>
                <Text style={styles.staffCardTitle}>Staff Management</Text>
                <Text style={styles.staffCardSubtitle}>
                  Manage all staff members, roles, schedules and permissions
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Modal */}
      <LogoutModal
        visible={logoutVisible}
        onLogout={handleLogoutConfirm}
        onCancel={() => setLogoutVisible(false)}
      />
    </View>
  );
};

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
  headerButton: {
    padding: 8,
  },
  headerButtonPlaceholder: {
    width: 40,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 50,
  },
  card: {
    width: width * 0.43,
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
  fullWidthCard: {
    width: '100%',
    marginBottom: 20,
  },
  staffCard: {
    width: '100%',
    backgroundColor: '#7d4a9a',
    padding: 25,
  },
  staffCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  staffTextContainer: {
    flex: 1,
  },
  staffCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  staffCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default AdminDashboardPage;