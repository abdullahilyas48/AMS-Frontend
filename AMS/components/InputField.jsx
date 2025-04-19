import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const InputField = ({ placeholder, iconName, secureTextEntry = false, value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{placeholder}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
        />
        <FontAwesome name={iconName} size={20} color="#555" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0D3F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
});

export default InputField;
