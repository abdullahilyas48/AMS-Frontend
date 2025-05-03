import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

export default function TrackLuggagePage() {
  const navigation = useNavigation(); 
  const [luggageId, setLuggageId] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackLuggage = async () => {
    if (!luggageId || !flightNumber) {
      Alert.alert('Missing Information', 'Please provide both Luggage ID and Flight Number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.1.7:7798/track-luggage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ luggageId, flightNumber })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(data.status);
      } else {
        setStatus('');
        Alert.alert('Tracking Failed', data.error || 'Unable to track your luggage. Please try again.');
      }
    } catch (error) {
      setStatus('');
      Alert.alert('Connection Error', 'Unable to connect to the server. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!status) return '#6b7280';
    if (status.toLowerCase().includes('delivered')) return '#10b981';
    if (status.toLowerCase().includes('transit')) return '#3b82f6';
    if (status.toLowerCase().includes('lost')) return '#ef4444';
    return '#6b7280';
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('UserHome')}
      >
        <Ionicons name="arrow-back" size={24} color="#7e22ce" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Ionicons name="airplane" size={32} color="#7e22ce" />
        <Text style={styles.title}>Track Your Luggage</Text>
        <Text style={styles.subtitle}>Enter your details to check luggage status</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Luggage ID</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="bag-check-outline" size={20} color="#7e22ce" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={luggageId}
              onChangeText={setLuggageId}
              placeholder="ABC123456"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Flight Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="airplane-outline" size={20} color="#7e22ce" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={flightNumber}
              onChangeText={setFlightNumber}
              placeholder="DL1234"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Status</Text>
          <View style={[styles.statusContainer, { backgroundColor: getStatusColor() + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {status || 'Not checked yet'}
            </Text>
            {status ? (
              <Ionicons 
                name={status.toLowerCase().includes('delivered') ? 'checkmark-circle' : 
                     status.toLowerCase().includes('lost') ? 'alert-circle' : 'time'} 
                size={20} 
                color={getStatusColor()} 
              />
            ) : (
              <Ionicons name="help-circle" size={20} color={getStatusColor()} />
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleTrackLuggage}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Checking...' : 'Check Luggage Status'}
        </Text>
        <Ionicons 
          name={isLoading ? 'refresh' : 'arrow-forward'} 
          size={20} 
          color="white" 
          style={styles.buttonIcon} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 24,
    paddingTop: 48,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7e22ce',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#7e22ce',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 10,
  },
});