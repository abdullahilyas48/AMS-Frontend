import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; 

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading: isAuthLoading } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Please enter both Email and Password.");
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.1.9:7798/user-login',
        { 
          email: email.trim(), 
          password: password.trim() 
        },
        { 
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Login response:", response.data);
      await login(
        response.data.token,
        response.data.user || { email: email.trim() },
        60 * 60 * 1000 
      );

      navigation.reset({
        index: 0,
        routes: [{ name: 'UserHome' }],
      });
    } catch (error) {
      console.error("Login Error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Login Failed", errorMessage);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignupRedirect = () => {
    navigation.navigate('Signup');
  };

  const handleAdminLogin = () => {
    navigation.navigate('AdminLogin');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Login</Text>

      <InputField 
        placeholder="Enter Email" 
        iconName="envelope" 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <InputField 
        placeholder="Enter Password" 
        iconName="lock" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleForgotPassword} style={styles.transparentButton}>
        <Text style={styles.transparentButtonText}>Forgot Password?</Text>
      </TouchableOpacity>

      <PrimaryButton 
        label={isAuthLoading ? "Logging in..." : "Login"} 
        onPress={handleLogin} 
        disabled={isAuthLoading}
      />

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={handleSignupRedirect}>
          <Text style={styles.link}>New User? <Text style={styles.bold}>Sign up</Text></Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleAdminLogin} style={styles.adminButton}>
          <FontAwesome name="shield" size={16} color="#333" />
          <Text style={styles.adminText}> Admin Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8BFE8',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    textAlign: 'center',
    marginVertical: 5,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  transparentButton: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  transparentButtonText: {
    color: '#333',
    textDecorationLine: 'underline',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  adminText: {
    color: '#333',
    marginLeft: 5,
  },
});

export default LoginPage;