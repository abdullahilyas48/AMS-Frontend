import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminLoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = async () => {
    console.log("Attempting admin login...");
  
    if (!email || !password) {
      alert("Please enter both Email and Password.");
      return;
    }
  
    try {
      console.log("Sending request to:", 'http://192.168.1.7:7798/admin-login');
      const response = await axios.post('http://192.168.1.7:7798/admin-login', {
        email: email.trim(),
        password: password.trim()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
  
      if (!response.data) {
        throw new Error("Empty response from server");
      }
  
      console.log("Message from server:", response.data.message);
      console.log("Token from server:", response.data.token);
      console.log("Admin from server:", response.data.admin);
  
      const { message, token, admin } = response.data;
  
      if (message && token && admin) {
        console.log("Login successful, storing token...");
        await AsyncStorage.multiSet([
          ['adminToken', token],
          ['adminData', JSON.stringify(admin)]
        ]);
  
        console.log("Navigation to AdminDashboard");
        navigation.replace('AdminDashboard');
      } else {
        throw new Error(response.data.message || "Invalid response structure");
      }
  
    } catch (error) {
      console.error("Full error:", error);
  
      let errorMessage = "Login failed. Please try again.";
  
      if (error.response) {
        console.log("Error status:", error.response.status);
        console.log("Error data:", error.response.data);
  
        if (error.response.status === 404) {
          errorMessage = "Admin account not found";
        } else if (error.response.status === 401) {
          errorMessage = "Invalid password";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        console.log("No response received");
        errorMessage = "No response from server. Check your network.";
      } else {
        console.log("Error message:", error.message);
        errorMessage = error.message || "Login error occurred";
      }
  
      alert(errorMessage);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      <InputField 
        placeholder="Enter Admin Email" 
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
});

export default AdminLoginPage;