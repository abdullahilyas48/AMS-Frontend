import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    userData: null,
    isLoading: true 
  });
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const [[, storedToken], [, storedExpiry], [, storedUserData]] = 
          await AsyncStorage.multiGet(['userToken', 'tokenExpiry', 'userData']);
          
        if (storedToken && storedExpiry) {
          const now = Date.now();
          if (now < parseInt(storedExpiry)) {
            setAuthState({
              isAuthenticated: true,
              token: storedToken,
              userData: storedUserData ? JSON.parse(storedUserData) : null,
              isLoading: false
            });
            return;
          }
        }
    
        // Token expired or not found, clear the storage
        await AsyncStorage.multiRemove(['userToken', 'userData', 'tokenExpiry']);
        setAuthState({ isAuthenticated: false, token: null, userData: null, isLoading: false });
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [navigation]);

  // 🔧 Fetch user details from backend if needed
  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log("JWT token:", token);
  
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await fetch('http://192.168.1.113:7798/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) throw new Error('Failed to fetch user data');
  
      const data = await response.json();
      console.log("Fetched user data:", data);
  
      // ✅ Update authState safely
      setAuthState(prev => ({ ...prev, userData: data }));
  
      return data;
    } catch (error) {
      console.error('Fetch user details failed:', error);
      return null;
    }
  };
  
  
  

  // 🔐 Login function
  const login = async (userToken, _, expiryOffset = 60 * 60 * 1000) => {
    try {
      const decoded = jwtDecode(userToken);
      console.log('JWT decoded:', decoded);
  
      const userData = {
        name: decoded.name,
        email: decoded.email,
      };
  
      const expiryTime = Date.now() + expiryOffset;
  
      await AsyncStorage.multiSet([
        ['userToken', userToken],
        ['userData', JSON.stringify(userData)],
        ['tokenExpiry', expiryTime.toString()]
      ]);
  
      setAuthState({
        isAuthenticated: true,
        token: userToken,
        userData,
        isLoading: false
      });
  
      // Optionally, call fetchUserDetails to make sure user data is updated from the server
      await fetchUserDetails();  // Make sure user details are fetched after login
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  

  // 🚪 Logout function
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData', 'tokenExpiry']);
      setAuthState({
        isAuthenticated: false,
        token: null,
        userData: null,
        isLoading: false
      });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return { ...authState, setAuthState, fetchUserDetails, login, logout };

};

export default useAuth;