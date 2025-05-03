import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';

const { width } = Dimensions.get('window');

const ManageHangarsPage = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();
  const [airplanes, setAirplanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  const fetchAirplanes = async () => {
    try {
      if (!userData?._id) return;
  
      const res = await fetch(`http://192.168.1.7:7798/airplanes/${userData._id}`);
  
      if (!res.ok) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        return;
      }
  
      const data = await res.json();
      setAirplanes(data.airplanes || []);
    } catch (err) {
      console.error('Error fetching airplanes:', err);
    } finally {
      setLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  
  useEffect(() => {
    fetchAirplanes();
  }, [userData]);

  const handleDelete = (airplaneId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this airplane registration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`http://192.168.1.7:7798/delete-airplane/${airplaneId}`, {
                method: 'DELETE',
              });
              const result = await res.json();
              if (result.success) {
                Alert.alert('Success', 'Airplane registration deleted.');
                fetchAirplanes();
              } else {
                Alert.alert('Error', result.message || 'Could not delete');
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Server error while deleting.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="arrow-left" size={28} color="#7e22ce" />
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="warehouse" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Fleet Management</Text>
          <Text style={styles.subtitle}>Manage your aircraft and hangar spaces</Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <TouchableOpacity 
            style={[styles.cardButton, styles.cardButtonPrimary]} 
            onPress={() => navigation.navigate('BookHangar')}
            activeOpacity={0.8}
          >
            <View style={styles.cardButtonIcon}>
              <MaterialCommunityIcons name="calendar-edit" size={24} color="#fff" />
            </View>
            <Text style={[styles.cardButtonText, styles.cardButtonTextPrimary]}>Book New Hangar</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Your Registered Aircraft</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7e22ce" />
            </View>
          ) : airplanes.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="airplane-off" size={48} color="#cbd5e1" />
              <Text style={styles.emptyStateText}>No aircraft registered yet</Text>
            </View>
          ) : (
            airplanes.map((airplane, index) => (
              <Animated.View 
                key={airplane._id} 
                style={[
                  styles.hangarCard,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  }
                ]}
              >
                <View style={styles.hangarInfo}>
                  <View style={styles.airplaneHeader}>
                    <MaterialCommunityIcons name="airplane-takeoff" size={20} color="#7e22ce" />
                    <Text style={styles.hangarTitle}>{airplane?.manufacturer} ({airplane?.regNo})</Text>
                  </View>
                  <Text style={styles.hangarSubtitle}>
                    {airplane?.type} • Terminal: {airplane?.spot?.terminal || 'N/A'}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleDelete(airplane._id)}
                  activeOpacity={0.6}
                  style={styles.deleteButton}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={22} color="#ef4444" />
                </TouchableOpacity>
              </Animated.View>
            ))
          )}

          <TouchableOpacity 
            style={styles.cardButton} 
            onPress={() => navigation.navigate('AddAirplane')}
            activeOpacity={0.8}
          >
            <View style={styles.cardButtonIconSecondary}>
              <Entypo name="aircraft" size={24} color="#7e22ce" />
            </View>
            <Text style={styles.cardButtonText}>Register New Aircraft</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 60,
    backgroundColor: '#f8fafc'
  },
  scrollContainer: { 
    padding: 24, 
    paddingBottom: 48 
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    shadowColor: '#7e22ce',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 32 
  },
  iconContainer: {
    backgroundColor: '#7e22ce',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7e22ce',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    fontFamily: 'sans-serif-medium',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334155',
    marginTop: 24,
    marginBottom: 20,
    marginLeft: 4,
    fontFamily: 'sans-serif-medium',
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardButtonPrimary: {
    backgroundColor: '#7e22ce',
    borderColor: '#7e22ce',
  },
  cardButtonText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  cardButtonTextPrimary: {
    color: 'white',
  },
  cardButtonIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 12,
  },
  cardButtonIconSecondary: {
    backgroundColor: '#ede9fe',
    padding: 10,
    borderRadius: 12,
  },
  hangarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  airplaneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  hangarInfo: { 
    flex: 1,
    marginRight: 10,
  },
  hangarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  hangarSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    marginVertical: 20,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default ManageHangarsPage;