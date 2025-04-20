import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const AdminLoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = async () => {
    console.log("Admin login button pressed");

    if (!email || !password) {
      alert("Please enter both Email and Password.");
      return;
    }

    console.log("Sending admin login request...");
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await axios.post('http://192.168.1.7:3001/admin-login', {
        email,
        password
      });

      console.log("Response Data:", response.data);

      const res = response.data;

      if (typeof res === 'string') {
        if (res.toLowerCase().includes('success')) {
          alert("Admin Login Successful!");
          navigation.navigate('AdminDashboard'); 
        } else {
          alert(res); 
        }
      } else {
        alert("Unexpected response from server.");
      }

    } catch (error) {
      console.error("Admin Login Error:", error);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <InputField 
        placeholder="Enter Admin Email" 
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

      <PrimaryButton label="Login" onPress={handleAdminLogin} />
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

export default AdminLoginPage;
