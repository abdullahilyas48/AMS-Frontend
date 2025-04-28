import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SideMenu from '../components/SideMenu'; 
import LogoutModal from '../components/LogoutModal';
import useAuth from '../hooks/useAuth';

export default function UserHomePage() {
  const navigation = useNavigation();
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { isAuthenticated, userData, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [isAuthenticated, isLoading, navigation]);

  const toggleSideMenu = () => {
    setSideMenuVisible(!sideMenuVisible);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Logout Error", "There was a problem logging out.");
    } finally {
      setLogoutModalVisible(false);
    }
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSideMenu}>
          <Entypo name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setLogoutModalVisible(true)}>
          <Ionicons name="log-out-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Side Menu */}
      {sideMenuVisible && (
        <SideMenu 
          closeMenu={() => setSideMenuVisible(false)}
          onLogout={() => {
            setSideMenuVisible(false);
            setLogoutModalVisible(true);
          }}
        />
      )}

      {/* Main Content */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>AMS</Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* Book a Flight */}
        <TouchableOpacity 
          style={styles.optionBox} 
          onPress={() => navigation.navigate('BookFlightPage')}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="airplane" size={30} color="#000" />
          </View>
          <View style={styles.optionTextWrapper}>
            <Text style={styles.optionTitle}>Book A Flight</Text>
            <Text style={styles.optionDesc}>Find and book flights for your next trip</Text>
          </View>
        </TouchableOpacity>

        {/* Hotel Booking */}
        <TouchableOpacity 
          style={styles.optionBox} 
          onPress={() => navigation.navigate('HotelPage')}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="bed-outline" size={30} color="#000" />
          </View>
          <View style={styles.optionTextWrapper}>
            <Text style={styles.optionTitle}>Need rest?</Text>
            <Text style={styles.optionDesc}>Get a 5-star sleep in a luxurious hotel</Text>
          </View>
        </TouchableOpacity>

        {/* Car Rental */}
        <TouchableOpacity 
          style={styles.optionBox} 
          onPress={() => navigation.navigate('RidePage')}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="car-sport-outline" size={30} color="#000" />
          </View>
          <View style={styles.optionTextWrapper}>
            <Text style={styles.optionTitle}>Need A Ride?</Text>
            <Text style={styles.optionDesc}>Reserve your ideal rental service before you fly</Text>
          </View>
        </TouchableOpacity>

        {/* VIP Service */}
        <TouchableOpacity 
          style={styles.optionBox} 
          onPress={() => navigation.navigate('VIPPage')}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="star-outline" size={30} color="#000" />
          </View>
          <View style={styles.optionTextWrapper}>
            <Text style={styles.optionTitle}>Need VIP Service?</Text>
            <Text style={styles.optionDesc}>Book VIP service for an exclusive airport experience</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Floating Message Icon */}
      <TouchableOpacity style={styles.messageIcon}>
        <Ionicons name="chatbubble-ellipses" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        visible={logoutModalVisible}
        onLogout={handleLogout}
        onCancel={cancelLogout}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainer: {
    position: 'absolute',
    top: 120,
    left: 25,
  },
  header: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#f5a8b8',
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 300,
  },
  optionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    width: '100%',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextWrapper: {
    flexShrink: 1,
    maxWidth: '80%',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flexWrap: 'wrap',
  },
  optionDesc: {
    fontSize: 14,
    color: '#000',
    flexWrap: 'wrap',
  },
  messageIcon: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 10,
  },
});