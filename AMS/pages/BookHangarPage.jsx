import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView, TextInput, ImageBackground } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import DateSelector from '../components/DateSelector';
import TimeSelector from '../components/TimeSelector';
import useAuth from '../hooks/useAuth';

const { width } = Dimensions.get('window');
const HANGAR_SIZE = width / 2 - 60;

const BookHangarPage = ({ navigation }) => {
    const [hangars, setHangars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [reservationId, setReservationId] = useState('');
    const [date, setDate] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [selectedHangar, setSelectedHangar] = useState(null);
    const { userData, isAuthenticated, fetchUserDetails, logout: authLogout, token: authToken } = useAuth();

    useFocusEffect(
        React.useCallback(() => {
            fetchAvailableHangars();
        }, [])
    );

    const fetchAvailableHangars = async () => {
        try {
            const response = await axios.get('http://192.168.1.7:7798/available-hangars');
            setHangars(response.data.hangars);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching hangars:', error);
            setLoading(false);
        }
    };

    const handleHangarBooking = async () => {
        if (!selectedHangar || !date || !startTime || !endTime || !ownerName) {
            alert('Please fill in all fields.');
            return;
        }

        if (!isAuthenticated) {
            alert('Please login to book a hangar.');
            navigation.navigate('Login');
            return;
        }

        let userId = userData?._id;
        if (!userId) {
            try {
                const freshUserData = await fetchUserDetails();
                if (!freshUserData?._id) throw new Error('No user ID found');
                userId = freshUserData._id;
            } catch (error) {
                console.error('Error fetching user details:', error);
                alert('Failed to verify user information. Please login again.');
                await authLogout();
                navigation.navigate('Login');
                return;
            }
        }

        try {
            const [startHours, startMinutes] = startTime.split(':').map(Number);
            const [endHours, endMinutes] = endTime.split(':').map(Number);
            
            if (endHours < startHours || (endHours === startHours && endMinutes <= startMinutes)) {
                alert('End time must be after start time');
                return;
            }

            const bookingData = {
                userid: userId,
                selectedHangarId: selectedHangar._id,
                ownerName,
                reservationDate: date.toISOString().split('T')[0],
                startTime: startTime,
                endTime: endTime
            };

            const res = await axios.post('http://192.168.1.7:7798/hangar-reservation', bookingData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (res.data.reservation && res.data.reservation._id) {
                alert(`✅ Hangar Booked Successfully!\n\nReservation ID: ${res.data.reservation._id}\nHangar: ${selectedHangar.number}\nTime: ${res.data.reservation.startTime} to ${res.data.reservation.endTime}`);
            } else {
                alert('Booking successful, but could not retrieve reservation details');
            }

            setShowBookingForm(false);
            setSelectedHangar(null);
            setDate(null);
            setStartTime('');
            setEndTime('');
            setOwnerName('');
            fetchAvailableHangars();
        } catch (err) {
            console.error('Booking error:', err);
            alert(err.response?.data?.message || 'Booking failed. Please try again.');
        }
    };

    const handleCancelReservation = async () => {
        if (!reservationId.trim()) {
            alert('Please enter your Reservation ID');
            return;
        }

        if (!isAuthenticated || !authToken) {
            alert('Please login to cancel a reservation');
            navigation.navigate('Login');
            return;
        }

        try {
            await axios.delete(`http://192.168.1.7:7798/delete-hangar-reservation/${reservationId}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            alert(`🗑️ Reservation Cancelled!\n\nID: ${reservationId}\n\nHangar has been made available.`);
            setShowCancelForm(false);
            setReservationId('');
            fetchAvailableHangars();
        } catch (error) {
            console.error('Cancellation error:', error);
            if (error.response?.status === 404) {
                alert('🔍 Reservation not found\nPlease check your Reservation ID');
            } else {
                alert(error.response?.data?.message || '❌ Failed to cancel reservation');
            }
        }
    };

    const renderHangar = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.hangarContainer,
                item.isAvailable ? styles.availableHangar : styles.occupiedHangar,
                { width: HANGAR_SIZE, height: HANGAR_SIZE }
            ]}
            onPress={() => {
                if (item.isAvailable) {
                    setSelectedHangar(item);
                    setShowBookingForm(true);
                }
            }}
            disabled={!item.isAvailable}
        >
            <View style={styles.hangarIconContainer}>
                <MaterialCommunityIcons
                    name="warehouse"
                    size={HANGAR_SIZE * 0.3}
                    color={item.isAvailable ? '#fff' : 'rgba(255,255,255,0.7)'}
                />
                {!item.isAvailable && (
                    <View style={styles.occupiedBadge}>
                        <Text style={styles.occupiedBadgeText}>BOOKED</Text>
                    </View>
                )}
            </View>
            <Text style={styles.hangarNumber}>Hangar {String(item.number)}</Text>
            <View style={styles.hangarDetails}>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="airport" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.hangarDetailText}>Terminal {String(item.terminalLocation)}</Text>
                </View>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="airplane" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.hangarDetailText}>Capacity: {String(item.capacity)}</Text>
                </View>
            </View>
            {item.isAvailable && (
                <View style={styles.availableBadge}>
                    <Text style={styles.availableBadgeText}></Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Hangar Booking</Text>
                    <Text style={styles.headerSubtitle}>Tap on an available hangar to reserve it</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, styles.availableCard]}>
                    <Text style={styles.statValue}>{hangars.filter(h => h.isAvailable).length}</Text>
                    <Text style={styles.statLabel}>Available</Text>
                    <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" style={styles.statIcon} />
                </View>
                <View style={[styles.statCard, styles.totalCard]}>
                    <Text style={styles.statValue}>{hangars.length}</Text>
                    <Text style={styles.statLabel}>Total Hangars</Text>
                    <MaterialCommunityIcons name="warehouse" size={24} color="#7B1FA2" style={styles.statIcon} />
                </View>
            </View>

            {/* Hangar Grid */}
            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <MaterialCommunityIcons name="airplane-takeoff" size={60} color="#9C27B0" />
                        <Text style={styles.loadingText}>Loading hangars...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={hangars}
                        renderItem={renderHangar}
                        keyExtractor={item => item._id}
                        numColumns={2}
                        contentContainerStyle={styles.listContainer}
                        columnWrapperStyle={styles.columnWrapper}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            {/* Original Floating Cancel Button */}
            <TouchableOpacity 
                style={styles.fabCancel}
                onPress={() => setShowCancelForm(true)}
            >
                <MaterialCommunityIcons name="close-circle-outline" size={30} color="#a074da" />
            </TouchableOpacity>

            {/* Booking Form Modal */}
            {showBookingForm && (
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalScrollContent}>
                        <Text style={styles.modalTitle}>Book Hangar</Text>
                        {selectedHangar && (
                            <View style={styles.selectedHangarInfo}>
                                <Text style={styles.selectedHangarText}>Selected: Hangar {selectedHangar.number}</Text>
                                <Text style={styles.selectedHangarText}>Terminal: {selectedHangar.terminalLocation}</Text>
                                <Text style={styles.selectedHangarText}>Capacity: {selectedHangar.capacity}</Text>
                            </View>
                        )}
                        
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Date</Text>
                            <DateSelector label="Date" date={date} onDateChange={setDate} />
                        </View>
                        
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Start Time</Text>
                            <TimeSelector label="Start Time" time={startTime} onTimeChange={setStartTime} />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>End Time</Text>
                            <TimeSelector label="End Time" time={endTime} onTimeChange={setEndTime} />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Owner Name</Text>
                            <TextInput 
                                style={styles.inputField} 
                                value={ownerName} 
                                onChangeText={setOwnerName} 
                                placeholder="Full Name" 
                                placeholderTextColor="#aaa" 
                            />
                        </View>

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={() => { setShowBookingForm(false); setSelectedHangar(null); }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.submitButton} 
                                onPress={handleHangarBooking}
                            >
                                <Text style={styles.submitButtonText}>Confirm Booking</Text>
                                <MaterialCommunityIcons name="send" size={18} color="#fff" style={styles.buttonIcon} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* Cancel Reservation Modal */}
            {showCancelForm && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, styles.cancelModalContent]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Cancel Reservation</Text>
                        </View>
                        
                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Reservation ID</Text>
                            <TextInput
                                style={styles.inputField}
                                value={reservationId}
                                onChangeText={setReservationId}
                                placeholder="Enter your reservation ID"
                                placeholderTextColor="#aaa"
                            />
                        </View>
                        
                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity 
                                style={[styles.cancelButton, styles.modalCancelButton]} 
                                onPress={() => { setShowCancelForm(false); setReservationId(''); }}
                            >
                                <Text style={styles.cancelButtonText}>Go Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.submitButton, styles.dangerButton]} 
                                onPress={handleCancelReservation}
                            >
                                <Text style={styles.submitButtonText}>Confirm Cancellation</Text>
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
        backgroundColor: '#f5f7fa' 
    },
    header: {
        height: 180,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#7B1FA2', 
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerOverlay: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
    },
    backButtonContainer: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8, 
    },
    headerTitle: { 
        fontSize: 24, 
        fontWeight: '600', 
        color: '#fff', 
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: -30,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        alignItems: 'center',
    },
    availableCard: {
        borderTopWidth: 4,
        borderTopColor: '#4CAF50',
    },
    totalCard: {
        borderTopWidth: 4,
        borderTopColor: '#7B1FA2',
    },
    statValue: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#333',
        marginBottom: 5,
    },
    statLabel: { 
        fontSize: 14, 
        color: '#666', 
        marginBottom: 10,
        fontWeight: '500',
    },
    statIcon: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    content: { 
        flex: 1, 
        paddingHorizontal: 15,
    },
    listContainer: { 
        paddingBottom: 100,
    },
    columnWrapper: { 
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    hangarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        margin: 5,
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    availableHangar: { 
        backgroundColor: '#7B1FA2',
    },
    occupiedHangar: { 
        backgroundColor: '#5D3587',
    },
    hangarIconContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    hangarNumber: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#fff',
        marginBottom: 10,
    },
    hangarDetails: {
        width: '100%',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    hangarDetailText: { 
        fontSize: 12, 
        color: 'rgba(255,255,255,0.9)', 
        marginLeft: 5,
    },
    availableBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    availableBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    occupiedBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'rgba(244, 67, 54, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    occupiedBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
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
        fontWeight: '500',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '100%',
        maxHeight: '85%',
    },
    modalScrollContent: {
        padding: 25,
    },
    cancelModalContent: {
        padding: 25,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    modalTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#333', 
        marginLeft: 10,
    },
    selectedHangarInfo: { 
        backgroundColor: '#F3E5F5', 
        padding: 15, 
        borderRadius: 12, 
        marginBottom: 20,
    },
    selectedHangarText: { 
        fontSize: 16, 
        color: '#7B1FA2',
        fontWeight: '500',
    },
    formGroup: {
        marginBottom: 20,
    },
    inputLabel: { 
        fontSize: 14, 
        color: '#555', 
        marginBottom: 8,
        fontWeight: '500',
    },
    inputField: {
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 10,
        padding: 15, 
        fontSize: 16, 
        backgroundColor: '#f9f9f9',
    },
    modalButtonRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 20,
    },
    submitButton: {
        backgroundColor: '#7B1FA2', 
        padding: 12, 
        borderRadius: 10,
        flex: 1, 
        marginLeft: 6, 
        alignItems: 'center',
        justifyContent: 'relative',
        flexDirection: 'row',
        elevation: 3,
    },
    dangerButton: {
        backgroundColor: '#f44336',
    },
    submitButtonText: { 
        color: '#fff', 
        fontWeight: '600', 
        fontSize: 16,
    },
    buttonIcon: {
        marginLeft: 8,
    },
    cancelButton: {
        backgroundColor: '#f0f0f0', 
        padding: 15, 
        borderRadius: 10,
        flex: 1, 
        marginRight: 10, 
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    modalCancelButton: {
        backgroundColor: '#e0e0e0',
    },
    cancelButtonText: { 
        color: '#7B1FA2', 
        fontWeight: '600', 
        fontSize: 16,
    },
    cancelNote: {
        fontSize: 12,
        color: '#777',
        marginTop: 10,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    fabContainer: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        alignItems: 'flex-end',
    },
    fab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f44336',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabCancel: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        backgroundColor: '#fff',
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    fabText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 14,
    },
});

export default BookHangarPage;