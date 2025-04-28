import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        setAuthState({
          isAuthenticated: false,
          token: null,
          userData: null,
          isLoading: false
        });
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState(prev => ({...prev, isLoading: false}));
      }
    };

    checkAuthStatus();
    
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [navigation]);

  const login = async (userToken, userData, expiryOffset = 60 * 60 * 1000) => {
    try {
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

  return { ...authState, login, logout };
};

export default useAuth;