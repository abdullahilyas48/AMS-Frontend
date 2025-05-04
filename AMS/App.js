import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserHomePage from './pages/UserHomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StaffDashboard from './pages/StaffDashboard';
import StaffSchedule from './pages/StaffSchedule';
import DutyAssignment from './pages/DutyAssignment';
import FlightInformation from './pages/FlightInformation';
import PassengerDetails from './pages/PassengerDetails';
import RidePage from './pages/RidePage';
import HotelPage from './pages/HotelPage';
import VIPPage from './pages/VIPPage';
import BookFlightPage from './pages/BookFlightPage';
import RescheduleFlight from './pages/RescheduleFlight';
import CurrencyConverter from './pages/CurrencyConverter'
import RewardsScreen from './pages/Rewards';
import UserProfilePage from './pages/UserProfilePage';
import SmartParking from './pages/SmartParking';
import TrackLuggagePage from './pages/TrackLuggagePage';
import TrackFlightStatusPage from './pages/TrackFlightStatusPage';
import CancelBookings from './pages/CancelBookings'
import ManageHangarsPage from './pages/ManageHangarsPage';
import AddAirplanePage from './pages/AddAirplanePage';
import BookHangarPage from './pages/BookHangarPage';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const checkTokenExpiry = async () => {
      try {
        const expiry = await AsyncStorage.getItem('tokenExpiry');
        const currentTime = Date.now();
        
        if (expiry && currentTime > parseInt(expiry)) {
          await AsyncStorage.multiRemove(['userToken', 'userData', 'tokenExpiry']);
        }
      } catch (error) {
        console.error('Token expiry check error:', error);
      }
    };

    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        <Stack.Screen name="AdminLogin" component={AdminLoginPage} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardPage} />
        <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
        <Stack.Screen name="DutyAssignment" component={DutyAssignment} />
        <Stack.Screen name="StaffSchedule" component={StaffSchedule} />
        <Stack.Screen name="FlightInformation" component={FlightInformation} />
        <Stack.Screen name="PassengerDetails" component={PassengerDetails} />
        <Stack.Screen name="UserHome" component={UserHomePage} />
        <Stack.Screen name="UserProfile" component={UserProfilePage} />
        <Stack.Screen name="RidePage" component={RidePage} />
        <Stack.Screen name="HotelPage" component={HotelPage} />
        <Stack.Screen name="VIPPage" component={VIPPage} />
        <Stack.Screen name="BookFlightPage" component={BookFlightPage} />
        <Stack.Screen name="RescheduleFlight" component={RescheduleFlight} />
        <Stack.Screen name="CurrencyConverter" component={CurrencyConverter} />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="SmartParking" component={SmartParking} />
        <Stack.Screen name="TrackLuggage" component={TrackLuggagePage} />
        <Stack.Screen name="TrackFlightStatus" component={TrackFlightStatusPage} />
        <Stack.Screen name="CancelBookings" component={CancelBookings} />
        <Stack.Screen name="ManageHangars" component={ManageHangarsPage} />
        <Stack.Screen name="BookHangar" component={BookHangarPage} />
        <Stack.Screen name="AddAirplane" component={AddAirplanePage} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}