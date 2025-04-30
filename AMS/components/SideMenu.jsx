import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function SideMenu() {
  const navigation = useNavigation();

  const menuItems = [
    { title: 'User Profile', screen: 'UserProfile' },
    { title: 'Reschedule Flight', screen: 'RescheduleFlight' },
    { title: 'Smart Parking', screen: 'SmartParking' }, // Added Smart Parking here
    { title: 'Check Flight Status', screen: 'FlightStatus' },
    { title: 'Currency Convertor', screen: 'CurrencyConvertor' },
    { title: 'Track Luggage', screen: 'LuggageTracking' },
    { title: 'Claim Rewards', screen: 'Rewards' },
    { title: 'Manage Hangar', screen: 'ManageHangar' },
  ];

  return (
    <View style={styles.fullScreenMenu}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'UserHome' }],
          });
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Menu items */}
      <View style={styles.menuItems}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuText}>{item.title}</Text>
            <View style={styles.underline} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  fullScreenMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: '#814d99',
    paddingTop: 60,
    paddingHorizontal: 30,
    zIndex: 999,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    marginVertical: 12,
  },
  menuText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
  underline: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    width: '100%',
    marginTop: 4,
  },
});