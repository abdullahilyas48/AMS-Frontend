import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TextInput, 
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { ImageBackground } from 'react-native';

const RewardsScreen = () => {
  const { userData, isLoading } = useAuth();
  const [points, setPoints] = useState(null);
  const [redeemInput, setRedeemInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchUserPoints = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.1.7:7798/user-rewards/${userData._id}`);
      const data = await response.json();
      setPoints(data.rewards);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch reward points.');
    } finally {
      setLoading(false);
    }
  };

  const redeemPoints = async () => {
    if (!redeemInput || isNaN(redeemInput)) {
      Alert.alert('Invalid Input', 'Please enter a valid number of points.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.7:7798/redeem-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData._id,
          points: parseInt(redeemInput),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPoints(data.remainingPoints);
        Alert.alert('Success', data.message);
        setRedeemInput('');
      } else {
        Alert.alert('Error', data.error || 'Could not redeem points.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while redeeming points.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData && userData._id) {
      fetchUserPoints();
    }
  }, [userData]);

  if (isLoading || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#A26AFF" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/airplane.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Reward Points</Text>
          <Text style={styles.points}>You have: {points ?? 0} points</Text>

          {/* New card with blurry purple effect */}
          <View style={styles.redeemCard}>
            <Text style={styles.redeemTitle}>Enter points to redeem</Text>
            <TextInput
              style={styles.redeemInput}
              placeholder="Enter points"
              value={redeemInput}
              onChangeText={setRedeemInput}
              keyboardType="numeric"
              placeholderTextColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity style={styles.redeemButton} onPress={redeemPoints}>
            <Text style={styles.redeemText}>Redeem</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5D4ED',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#A26AFF',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  card: {
    backgroundColor: 'rgba(162, 90, 255, 0.5)', // Purple with transparency
    width: '85%',
    borderRadius: 25,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#5F4B8B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  redeemButton: {
    backgroundColor: '#A26AFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
   // shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
   // shadowOpacity: 0.2,
    //shadowRadius: 3,
    elevation: 5,
  },
  
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff', // White color for the title
    marginBottom: 10,
    fontFamily: 'System',
  },
  points: {
    fontSize: 20,
    color: '#fff', // White color for points text
    marginBottom: 20,
  },
  redeemCard: {
    backgroundColor: 'rgba(162, 90, 255, 0.5)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redeemTitle: {
    fontSize: 20,
    color: '#fff', // White text for the title
    marginBottom: 10,
  },
  redeemInput: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    //backgroundColor: 'rgba(215, 134, 235, 0.81)', // Blurry purple effect
    backgroundColor: '#D6B4FC',
    fontSize: 16,
    marginBottom: 20,
    color: '#4C3575',
  },
  redeemText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RewardsScreen;
