import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log("Login button pressed");
  
    if (!email || !password) {
      alert("Please enter both Email/Username and Password.");
      return;
    }
  
    console.log("Sending login request...");
    console.log("Email:", email);
    console.log("Password:", password);
  
    try {
      const response = await axios.post('http://192.168.1.9:3001/user-login', {
        email,
        password
      });
  
      console.log("Response Data:", response.data);
  
      const res = response.data;
  
      if (res?.status === 'success') {
        alert(res.message || "Login Successful!");
        navigation.navigate('UserHome');
      } else if (res?.status === 'error') {
        alert(res.message || "Login failed.");
      } else {
        alert("Unexpected response from server.");
      }
  
    } catch (error) {
      console.error("Login Error:", error);
  
      if (error.response) {
        console.log("Error Response Data:", error.response.data);
      } else if (error.request) {
        console.log("No response received from server:", error.request);
      } else {
        console.log("Error setting up the request:", error.message);
      }
  
      alert("Server error. Please check your connection and try again.");
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
        placeholder="Enter Email / Username" 
        iconName="envelope" 
        value={email} 
        onChangeText={setEmail} 
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

      <PrimaryButton label="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={handleSignupRedirect}>
        <Text style={styles.link}>New User? <Text style={styles.bold}>Sign up</Text></Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAdminLogin}>
        <Text style={styles.link}><FontAwesome name="shield" /> Admin Login</Text>
      </TouchableOpacity>
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
  link: {
    textAlign: 'center',
    marginTop: 10,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  transparentButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: 10,
  },
  transparentButtonText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
});

export default LoginPage;
