import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';

const ForgotPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');  // New state for password

  const handlePasswordReset = async () => {
    if (!email || !newPassword) {
      Alert.alert('Error', 'Please enter both email and new password.');
      return;
    }
  
    try {
      const response = await axios.post('http://192.168.1.7:3001/reset-user-password', {
        email,
        newPassword,
      });
  
      console.log("Response from backend:", response.data); // Log the full response
  
      const res = response.data;

      if (res.Status === "success") {
        Alert.alert('Success', 'Password updated successfully.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', res.Status || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error during password reset:', error); 
      Alert.alert('Error', `Failed to reset password. Details: ${error.message}`);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and new password.
      </Text>

      <InputField
        placeholder="Enter your Email/Username"
        iconName="envelope"
        value={email}
        onChangeText={setEmail}
      />

      <InputField
        placeholder="Enter your New Password"
        iconName="lock"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={true}
      />

      <PrimaryButton label="Reset Password" onPress={handlePasswordReset} />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back to Login</Text>
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
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  backLink: {
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
});

export default ForgotPasswordPage;
