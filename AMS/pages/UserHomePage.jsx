import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function UserHomePage() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Entypo name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="log-out-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>AMS</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('RidePage')}>
          <View style={styles.iconWrapper}>
            <Ionicons name="car-sport-outline" size={30} color="#000" />
          </View>
          <View style={styles.optionTextWrapper}>
            <Text style={styles.optionTitle}>Need A Ride?</Text>
            <Text style={styles.optionDesc}>Reserve your ideal rental service before you fly</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('HotelPage')}>
          <View style={styles.iconWrapper}>
            <Ionicons name="bed-outline" size={30} color="#000" />
          </View>
          <View style={styles.optionTextWrapper}>
            <Text style={styles.optionTitle}>Need rest?</Text>
            <Text style={styles.optionDesc}>Get a 5-star sleep in a luxurious hotel</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('ParkingPage')}>
          <View style={styles.iconWrapper}>
            <Ionicons name="car-outline" size={30} color="#000" />
          </View>
          <View style={styles.optionTextWrapper}>
            <Text style={styles.optionTitle}>Smart Parking</Text>
            <Text style={styles.optionDesc}>Smart Parking that saves time, space, and stress</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('VIPPage')}>
          <View style={styles.iconWrapper}>
            <Ionicons name="star-outline" size={30} color="#000" />
          </View>
          <View style={styles.optionTextWrapper}>
            <Text style={styles.optionTitle}>Need VIP Service?</Text>
            <Text style={styles.optionDesc}>Book VIP service for an exclusive airport experience</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.messageIcon}>
        <Ionicons name="chatbubble-ellipses" size={30} color="#fff" />
      </TouchableOpacity>
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
    left:25,
    
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