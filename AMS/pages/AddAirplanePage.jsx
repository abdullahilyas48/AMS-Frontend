import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth'; // Adjust path as needed

const AddAirplanePage = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();

  const [manufacturer, setManufacturer] = useState('');
  const [aircraftType, setAircraftType] = useState('');
  const [registration, setRegistration] = useState('');
  const [hangarOptions, setHangarOptions] = useState([]);
  const [selectedHangar, setSelectedHangar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHangarModal, setShowHangarModal] = useState(false);
  const [airplaneId, setAirplaneId] = useState(null); // NEW

  useEffect(() => {
    if (!userData?._id) return;

    fetch(`http://192.168.1.7:7798/hangar-reservation/${userData._id}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !Array.isArray(data.reservations)) {
          throw new Error('Invalid hangar data format');
        }

        const available = data.reservations
          .filter(r => r.spot && r.spot.isAvailable === false)
          .map(r => ({
            label: `Hangar ${r.spot.number} - Terminal ${r.spot.terminalLocation}`,
            value: r.spot._id,
          }));

        setHangarOptions(available);
      })
      .catch(err => {
        console.error('Error fetching hangars:', err);
        Alert.alert('Error', 'Failed to load your reserved hangars.');
      });
  }, [userData]);

  const handleAddAirplane = async () => {
    if (!selectedHangar || !manufacturer || !aircraftType || !registration) {
      Alert.alert('Missing Fields', 'Please fill in all fields and select a hangar.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('http://192.168.1.7:7798/add-airplane', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData._id,
          spotId: selectedHangar,
          manufacturer,
          type: aircraftType,
          regNo: registration,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        setAirplaneId(json.airplane?._id); // Store airplane ID
        Alert.alert('Success', 'Aircraft registered successfully!');
      } else {
        throw new Error(json.message || 'Error adding airplane');
      }
    } catch (err) {
      console.error('Add airplane error:', err);
      Alert.alert('Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAirplane = async () => {
    if (!airplaneId) return;

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this airplane registration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const res = await fetch(`http://192.168.1.7:7798/delete-airplane/${airplaneId}`, {
                method: 'DELETE',
              });

              const json = await res.json();

              if (res.ok) {
                Alert.alert('Deleted', 'Airplane registration deleted.');
                navigation.goBack();
              } else {
                throw new Error(json.message || 'Delete failed');
              }
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert('Error', err.message);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#7e22ce" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Entypo name="aircraft" size={32} color="#7e22ce" />
          <Text style={styles.title}>Register New Aircraft</Text>
          <Text style={styles.subtitle}>
            Select a reserved hangar and enter aircraft details
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Select Hangar</Text>
          <TouchableOpacity
            onPress={() => setShowHangarModal(true)}
            style={styles.dropdownButton}
          >
            <Text style={selectedHangar ? styles.dropdownText : styles.dropdownPlaceholder}>
              {selectedHangar
                ? hangarOptions.find(h => h.value === selectedHangar)?.label
                : 'Select a hangar...'}
            </Text>
          </TouchableOpacity>

          <Modal visible={showHangarModal} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Choose a Hangar</Text>
                <FlatList
                  data={hangarOptions}
                  keyExtractor={item => item.value}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        setSelectedHangar(item.value);
                        setShowHangarModal(false);
                      }}
                      style={styles.modalOption}
                    >
                      <Text style={styles.modalOptionText}>{item.label}</Text>
                    </Pressable>
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowHangarModal(false)}
                  style={styles.modalCancel}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Manufacturer</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="factory" size={20} color="#7e22ce" style={styles.icon} />
              <TextInput
                style={styles.input}
                value={manufacturer}
                onChangeText={setManufacturer}
                placeholder="e.g. Boeing"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Aircraft Type</Text>
            <View style={styles.inputContainer}>
              <Entypo name="aircraft" size={20} color="#7e22ce" style={styles.icon} />
              <TextInput
                style={styles.input}
                value={aircraftType}
                onChangeText={setAircraftType}
                placeholder="e.g. 747"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Registration Number</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="card-text" size={20} color="#7e22ce" style={styles.icon} />
              <TextInput
                style={styles.input}
                value={registration}
                onChangeText={setRegistration}
                placeholder="e.g. N12345"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleAddAirplane}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Register Aircraft</Text>
              <MaterialCommunityIcons name="plus-circle" size={24} color="white" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {airplaneId && (
        <TouchableOpacity style={styles.floatingDeleteButton} onPress={handleDeleteAirplane}>
          <MaterialCommunityIcons name="trash-can-outline" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: 48 },
  scrollContainer: { padding: 24, paddingBottom: 48 },
  backButton: { position: 'absolute', top: 48, left: 24, zIndex: 1, padding: 8 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center' },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputGroup: { marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#111827' },
  primaryButton: {
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
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  dropdownButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  modalCancel: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#7e22ce',
    fontWeight: '600',
  },
  floatingDeleteButton: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 50,
    elevation: 5,
    zIndex: 10,
  },
});

export default AddAirplanePage;
