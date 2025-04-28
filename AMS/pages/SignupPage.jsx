import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net|org)$/;
    if (!emailRegex.test(trimmedEmail)) {
        alert('Please enter a valid email address (like name@gmail.com).');
        return;
    }

    if (trimmedPassword.length < 7) {
        alert('Password must be at least 7 characters long.');
        return;
    }

    if (trimmedPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        const response = await axios.post('http://192.168.100.18:7798/register-user', {
            name,
            email: trimmedEmail,
            password: trimmedPassword,
        });

        console.log("API Response:", response.data);

        if (response.data?.error) {
            alert(`Signup failed: ${response.data.error}`);
            return;
        }

        if (!response.data._id || !response.data.email || !response.data.name) {
            alert('Signup successful, but missing user data in response.');
            return;
        }
        await AsyncStorage.setItem('userData', JSON.stringify(response.data));
        console.log("Stored User Data:", response.data);

        alert('Signup successful! Please log in.');
        navigation.navigate('Login');

    } catch (error) {
        console.error('Signup Error:', error);
        if (error.response) {
            alert(`Signup failed: ${error.response.data.error || error.response.statusText}`);
        } else if (error.request) {
            alert('Network error - please check your connection');
        } else {
            alert('Signup error: ' + error.message);
        }
    }
};
  
  const checkUserData = async () => {
    const storedUserData = await AsyncStorage.getItem('userData');
    console.log("Stored User Data: ", storedUserData);
  };
  
  
  const handleLoginRedirect = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Sign-up</Text>

      <InputField
        placeholder="Enter Name"
        iconName="id-card"
        value={name}
        onChangeText={setName}
      />
      <InputField
        placeholder="Enter Email"
        iconName="envelope"
        value={email}
        onChangeText={setEmail}
      />
      <InputField
        placeholder="Enter Password"
        iconName="shield"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <InputField
        placeholder="Confirm Password"
        iconName="check"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <PrimaryButton label="Sign-up" onPress={handleSignup} />

      <TouchableOpacity onPress={handleLoginRedirect}>
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink}>
            Login <FontAwesome name="sign-in" />
          </Text>
        </Text>
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
  loginText: {
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '500',
  },
  loginLink: {
    fontWeight: 'bold',
  },
});

export default SignupPage;
