import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import axios from 'axios';

const ForgotPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordReset = async () => {
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
  
    try {
      const response = await axios.post('http://192.168.1.7:7798/reset-user-password', {
        email,
        newPassword,
        confirmPassword,
      });
  
      console.log("Response from backend:", response.data);
  
      const res = response.data;
      if (res.Status === "Password updated successfully") {
        Alert.alert('Success', 'Password updated successfully.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', res.Error || 'Something went wrong.');
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
        Enter your email, new password, and confirm it.
      </Text>

      <InputField
        placeholder="Enter your Email"
        iconName="envelope"
        value={email}
        onChangeText={setEmail}
      />

      <InputField
        placeholder="Enter New Password"
        iconName="lock"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={true}
      />

      <InputField
        placeholder="Confirm New Password"
        iconName="lock"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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
