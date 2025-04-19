import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { FontAwesome } from '@expo/vector-icons';

const SignupPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    // Add signup logic or API call here
    console.log('Signup Info:', { name, email, password, confirmPassword });
    navigation.navigate('Login');
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