import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { FontAwesome } from '@expo/vector-icons';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login clicked:', email, password);
    // Navigate to user home/dashboard if successful
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password pressed');
    // Add navigation or modal here for resetting password
  };

  const handleSignupRedirect = () => {
    navigation.navigate('Signup');
  };

  const handleAdminLogin = () => {
    console.log('Redirect to Admin Login');
    // Add navigation to admin login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Login</Text>

      <InputField placeholder="Enter Email / Username" iconName="envelope" value={email} onChangeText={setEmail} />
      <InputField placeholder="Enter Password" iconName="lock" secureTextEntry value={password} onChangeText={setPassword} />

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
