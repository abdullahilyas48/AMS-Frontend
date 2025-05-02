import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AdminSideMenu({ onClose }) {
  const navigation = useNavigation();

  const menuItems = [
    { title: 'Flight Information', screen: 'Flights' },
    { title: 'Passenger Details', screen: 'PassengerDetails' },
    { title: 'Staff Dashboard', screen: 'StaffDashboard' },
  ];

  return (
    <View style={styles.fullScreenMenu}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.menuItems}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              onClose();
              setTimeout(() => navigation.navigate(item.screen), 100);
            }}
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
