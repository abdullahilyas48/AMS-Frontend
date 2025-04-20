import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserHomePage = ({ route }) => {
  const { user } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome {user?.name || 'User'}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#D8BFE8',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', 
  },
});

export default UserHomePage;
