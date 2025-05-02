import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import DateSelector from '../components/DateSelector'; 
import TimeSelector from '../components/TimeSelector'; 
import useAuth from '../hooks/useAuth';

const { width } = Dimensions.get('window');
const SPOT_SIZE = width / 4 - 20;

const SmartParking = ({ navigation }) => { 
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInputForm, setShowInputForm] = useState(false);
    const [inputSlotNumber, setInputSlotNumber] = useState('');
    const [inputTerminal, setInputTerminal] = useState('');
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [reservationId, setReservationId] = useState('');
    const [date, setDate] = useState(null); // Changed to null for DateSelector
    const [time, setTime] = useState(''); // Keep as string for TimeSelector
    const [duration, setDuration] = useState('');
    const [fullName, setFullName] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const { 
        userData, 
        isAuthenticated, 
        fetchUserDetails, 
        logout: authLogout,
        token: authToken 
    } = useAuth();

    useFocusEffect(
        React.useCallback(() => {
            fetchParkingSpots();
        }, [])
    );
  
    const fetchParkingSpots = async () => {
        try {
            console.log('Fetching from URL: http://192.168.1.7:7798/parking-spots');
            const response = await axios.get('http://192.168.1.7:7798/parking-spots');
            setSpots(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching spots:', error);
            setLoading(false);
        }
    };

    const handleManualBooking = async () => {
        // Validate all form fields
        if (!inputSlotNumber || !inputTerminal || !date || !time || !duration || 
            !fullName || !vehicleType || !licensePlate) {
            alert('Please fill in all fields.');
            return;
        }
    
        // Check authentication status first
        if (!isAuthenticated) {
            alert('Please login to book a parking spot.');
            navigation.navigate('Login');
            return;
        }
    
        console.log('Initial User Data:', userData);
    
        // Check if we have user ID from existing data
        let userId = userData?._id;
        
        // If no ID found in existing data, try to fetch fresh data
        if (!userId) {
            try {
                const freshUserData = await fetchUserDetails();
                console.log('Fresh User Data:', freshUserData);
                
                if (!freshUserData?._id) {
                    throw new Error('No user ID found in fresh data');
                }
                userId = freshUserData._id;
            } catch (error) {
                console.error('Error fetching user details:', error);
                alert('Failed to verify user information. Please login again.');
                await authLogout();
                navigation.navigate('Login');
                return;
            }
        }
    
        // Find matching parking spot
        const matchingSpot = spots.find(
            spot => String(spot.number).toUpperCase() === inputSlotNumber.toUpperCase() &&
                   String(spot.terminalLocation).toLowerCase() === inputTerminal.toLowerCase()
        );
    
        if (!matchingSpot) {
            alert('No such slot found.');
            return;
        }
    
        if (!matchingSpot.isAvailable) {
            alert('This slot is already occupied.');
            return;
        }
    
        try {
            // Calculate end time based on duration
            const [hours, minutes] = time.split(':').map(Number);
            const endTime = new Date();
            endTime.setHours(hours + parseInt(duration));
            endTime.setMinutes(minutes);
            const formattedEndTime = `${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`;
    
            // Prepare booking data
            const bookingData = {
                selectedSpotId: matchingSpot._id,
                fullName,
                vehicleType,
                licensePlate,
                reservationDate: date.toISOString().split('T')[0],
                startTime: time,
                endTime: formattedEndTime,
                userId
            };
    
            console.log('Booking payload:', bookingData);
    
            // Make booking request
            const res = await axios.post('http://192.168.1.7:7798/parking-reservation', bookingData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
    
            // Handle success with reservation ID
            if (res.data.reservation && res.data.reservation._id) {
                alert(`✅ Booking Successful!\n\nReservation ID: ${res.data.reservation._id}\nSpot: ${inputTerminal}${inputSlotNumber}\nDate: ${new Date(res.data.reservation.reservationDate).toLocaleDateString()}\nTime: ${res.data.reservation.startTime} to ${res.data.reservation.endTime}\n\nPlease save your Reservation ID for future reference.`);
            } else {
                alert('Booking successful, but could not retrieve reservation details');
            }
    
            
            // Clear form fields
            setShowInputForm(false);
            setInputSlotNumber('');
            setInputTerminal('');
            setDate(null);
            setTime('');
            setDuration('');
            setFullName('');
            setVehicleType('');
            setLicensePlate('');
            
            // Refresh parking spots
            fetchParkingSpots();
        } catch (err) {
            console.error('Booking error:', {
                message: err.message,
                response: err.response?.data,
                stack: err.stack
            });
            alert(err.response?.data?.message || 'Booking failed. Please try again.');
        }
    };

    const handleCancelReservation = async () => {
        // Validate reservation ID input
        if (!reservationId.trim()) {
            alert('Please enter your Reservation ID');
            return;
        }
    
        // Check authentication
        if (!isAuthenticated || !authToken) {  // Changed to authToken
            alert('Please login to cancel a reservation');
            navigation.navigate('Login');
            return;
        }
    
        // Verify we have user ID
        let userId = userData?._id;
        if (!userId) {
            try {
                const freshUserData = await fetchUserDetails();
                userId = freshUserData?._id;
                if (!userId) {
                    alert('User information not available. Please login again.');
                    await authLogout();
                    navigation.navigate('Login');
                    return;
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                alert('Failed to verify user information. Please login again.');
                await authLogout();
                navigation.navigate('Login');
                return;
            }
        }
    
        try {
            // First verify the reservation exists and belongs to user
            const verificationRes = await axios.get(
                `http://192.168.1.7:7798/reservations/${reservationId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`  // Changed to authToken
                    }
                }
            );
    
            if (verificationRes.data.userId !== userId) {
                alert('❌ You can only cancel your own reservations');
                return;
            }
    
            // If verification passed, proceed with cancellation
            await axios.delete(
                `http://192.168.1.7:7798/cancel-parking-reservation/${reservationId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`  // Changed to authToken
                    }
                }
            );
    
            alert(`🗑️ Reservation Cancelled!\n\nID: ${reservationId}\n\nSpot has been made available for others.`);
            
            // Reset form and refresh data
            setShowCancelForm(false);
            setReservationId('');
            fetchParkingSpots();
            
        } catch (error) {
            console.error('Cancellation error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
    
            if (error.response) {
                if (error.response.status === 404) {
                    alert('🔍 Reservation not found\nPlease check your Reservation ID');
                } else if (error.response.status === 403) {
                    alert('⛔ Access Denied\nYou can only cancel your own reservations');
                } else {
                    alert(error.response.data?.message || '❌ Failed to cancel reservation');
                }
            } else {
                alert('🌐 Network Error\nPlease check your internet connection');
            }
        }
    };
  
    const renderSpot = ({ item }) => (
        <View 
            style={[ 
                styles.spotContainer, 
                item.isAvailable ? styles.availableSpot : styles.occupiedSpot, 
                { width: SPOT_SIZE, height: SPOT_SIZE } 
            ]}
        >
            <Ionicons 
                name="car-sport" 
                size={SPOT_SIZE * 0.4} 
                color={item.isAvailable ? '#fff' : 'rgba(255,255,255,0.7)'} 
            />
            <Text style={styles.spotNumber}>{String(item.number)}</Text>
            <Text style={styles.spotLocation}>{String(item.terminalLocation)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Smart Parking</Text>
                <View style={{ width: 24 }} />
            </View>
    
            {/* Stats Card */}
            <View style={styles.statsCard}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{spots.filter(s => s.isAvailable).length}</Text>
                    <Text style={styles.statLabel}>Available</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{spots.length}</Text>
                    <Text style={styles.statLabel}>Total Spots</Text>
                </View>
            </View>
    
            {/* Parking Spots Grid */}
            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Ionicons name="car-sport" size={60} color="#9C27B0" />
                        <Text style={styles.loadingText}>Loading parking spots...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={spots}
                        renderItem={renderSpot}
                        keyExtractor={item => item._id}
                        numColumns={4}
                        contentContainerStyle={styles.listContainer}
                        columnWrapperStyle={styles.columnWrapper}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
    
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.bookNowButton}
                    onPress={() => setShowInputForm(true)}
                >
                    <Text style={styles.bookNowText}>Book Now</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.cancelReservationButton}
                    onPress={() => setShowCancelForm(true)}
                >
                    <Text style={styles.cancelReservationText}>Cancel Reservation</Text>
                </TouchableOpacity>
            </View>

            {/* Booking Form */}
            {showInputForm && (
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Book Parking Spot</Text>
                        
                        <Text style={styles.inputLabel}>Slot Number (e.g., D1, C2):</Text>
                        <TextInput
                            style={styles.inputField}
                            value={inputSlotNumber}
                            onChangeText={setInputSlotNumber}
                            placeholder="Slot Number"
                            placeholderTextColor="#aaa"
                            autoCapitalize="characters"
                        />

                        <Text style={styles.inputLabel}>Terminal Location:</Text>
                        <TextInput
                            style={styles.inputField}
                            value={inputTerminal}
                            onChangeText={setInputTerminal}
                            placeholder="Terminal"
                            placeholderTextColor="#aaa"
                        />

<DateSelector 
                            label="Date"
                            date={date}
                            onDateChange={setDate}
                        />

                        <TimeSelector 
                            label="Time"
                            time={time}
                            onTimeChange={setTime}
                        />

<Text style={styles.inputLabel}>Duration (hours):</Text>
                        <TextInput
                            style={styles.inputField}
                            value={duration}
                            onChangeText={setDuration}
                            placeholder="e.g., 2"
                            placeholderTextColor="#aaa"
                            keyboardType="numeric"
                        />

                        <Text style={styles.inputLabel}>Full Name:</Text>
                        <TextInput
                            style={styles.inputField}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Full Name"
                            placeholderTextColor="#aaa"
                        />

                        <Text style={styles.inputLabel}>Vehicle Type:</Text>
                        <TextInput
                            style={styles.inputField}
                            value={vehicleType}
                            onChangeText={setVehicleType}
                            placeholder="e.g., Sedan"
                            placeholderTextColor="#aaa"
                        />

                        <Text style={styles.inputLabel}>License Plate:</Text>
                        <TextInput
                            style={styles.inputField}
                            value={licensePlate}
                            onChangeText={setLicensePlate}
                            placeholder="e.g., AB123CD"
                            placeholderTextColor="#aaa"
                        />

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={() => {
                                    setShowInputForm(false);
                                    setInputSlotNumber('');
                                    setInputTerminal('');
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.submitButton} 
                                onPress={handleManualBooking}
                            >
                                <Text style={styles.submitButtonText}>Book Now</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* Cancel Reservation Form */}
            {showCancelForm && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cancel Reservation</Text>
                        
                        <Text style={styles.inputLabel}>Enter Reservation ID:</Text>
                        <TextInput
                            style={styles.inputField}
                            value={reservationId}
                            onChangeText={setReservationId}
                            placeholder="Reservation ID"
                            placeholderTextColor="#aaa"
                        />

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={() => {
                                    setShowCancelForm(false);
                                    setReservationId('');
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.submitButton} 
                                onPress={handleCancelReservation}
                            >
                                <Text style={styles.submitButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F5FF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 50,
        backgroundColor: '#9C27B0',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 5,
        shadowColor: '#7B1FA2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'sans-serif-medium',
    },
    statsCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        marginTop: -20,
        elevation: 3,
        shadowColor: '#E1BEE7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#E1BEE7',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7B1FA2',
    },
    statLabel: {
        fontSize: 14,
        color: '#9E9E9E',
        marginTop: 5,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#F3E5F5',
        height: '100%',
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    spotContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        margin: 5,
        padding: 10,
        elevation: 2,
        shadowColor: '#7B1FA2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    availableSpot: {
        backgroundColor: '#AB47BC',
    },
    occupiedSpot: {
        backgroundColor: '#7B1FA2',
    },
    spotNumber: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    spotLocation: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#7B1FA2',
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginVertical: 15,
        paddingHorizontal: 15, 
    },
    bookNowButton: {
        flex: 1, 
        backgroundColor: '#9C27B0',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#7B1FA2',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginRight: 10, 
    },
    bookNowText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    cancelReservationButton: {
        flex: 1, 
        backgroundColor: '#e53935',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#d32f2f',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginLeft: 10, 
    },
    cancelReservationText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '100%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7B1FA2',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 14,
        color: '#616161',
        marginBottom: 5,
        marginTop: 10,
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#E1BEE7',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    submitButton: {
        backgroundColor: '#9C27B0',
        padding: 15,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
        padding: 15,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#616161',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SmartParking;