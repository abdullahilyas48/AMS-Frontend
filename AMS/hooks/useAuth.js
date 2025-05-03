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

  const fetchUserDetails = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) throw new Error('No token found');

        const response = await fetch('http://192.168.1.7:7798/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        
        const existingData = JSON.parse(await AsyncStorage.getItem('userData') || '{}');
        
        const mergedData = {
            ...data,
            _id: existingData._id 
        };

        await AsyncStorage.setItem('userData', JSON.stringify(mergedData));
        
        setAuthState(prev => ({
            ...prev,
            userData: mergedData,
            isAuthenticated: true
        }));

        return mergedData;
    } catch (error) {
        console.error('Fetch user details failed:', error);
        throw error; 
    }
};
  
const login = async (userToken, _, expiryOffset = 60 * 60 * 1000) => {
  try {
      const decoded = jwtDecode(userToken);
      console.log('JWT decoded:', decoded);

      const userFromToken = {
          _id: decoded.userId || decoded._id || decoded.sub, 
          email: decoded.email,
          name: decoded.name || 'User' 
      };

      const expiryTime = Date.now() + expiryOffset;

      await AsyncStorage.multiSet([
          ['userToken', userToken],
          ['tokenExpiry', expiryTime.toString()],
          ['userData', JSON.stringify(userFromToken)] 
      ]);

      let fullUserData;
      try {
          fullUserData = await fetchUserDetails();
          console.log('Fetched user data:', fullUserData);
          
          const mergedUserData = {
              ...userFromToken,
              ...fullUserData,
              _id: userFromToken._id 
          };
          
          await AsyncStorage.setItem('userData', JSON.stringify(mergedUserData));
          
          setAuthState({
              isAuthenticated: true,
              token: userToken,
              userData: mergedUserData,
              isLoading: false
          });
          
          return mergedUserData;
      } catch (fetchError) {
          console.log('Using token data as fallback', fetchError);
          setAuthState({
              isAuthenticated: true,
              token: userToken,
              userData: userFromToken,
              isLoading: false
          });
          return userFromToken;
      }
  } catch (error) {
      console.error('Login error:', error);
      throw error;
  }
};
  
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