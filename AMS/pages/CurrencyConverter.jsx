import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import PrimaryButton from '../components/PrimaryButton';
import InputField from '../components/InputField';
import { Ionicons } from '@expo/vector-icons';

const currencies = ['USD', 'EUR', 'PKR', 'GBP'];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState(null);
  const [toCurrency, setToCurrency] = useState(null);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [result, setResult] = useState(null);

  const handleConvert = async () => {
    if (!amount || !fromCurrency || !toCurrency) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }
    if (fromCurrency === toCurrency) {
      Alert.alert('Validation Error', 'From and To currencies must be different');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.7:7798/convert-currency', {
        amount: parseFloat(amount),
        fromCurrency,
        toCurrency,
      });
      setResult(response.data);
    } catch (error) {
      Alert.alert('Conversion Failed', error.response?.data?.error || error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient colors={['#7B1FA2', '#9C27B0']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => console.log('Back pressed')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Currency Converter</Text>
      </LinearGradient>

      <View style={styles.card}>
        <InputField
          placeholder="Enter amount"
          iconName="cash-outline"
          iconColor="#999"
          value={amount}
          onChangeText={setAmount}
          containerStyle={styles.inputField}
        />

        <Text style={styles.label}>From Currency</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setShowFromDropdown(!showFromDropdown);
            setShowToDropdown(false);
          }}
        >
          <Text style={styles.dropdownText}>{fromCurrency || 'Select currency'}</Text>
          <Ionicons name="chevron-down" size={20} color="#6A1B9A" />
        </TouchableOpacity>
        {showFromDropdown && (
          <View style={styles.dropdownList}>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency}
                style={styles.dropdownItem}
                onPress={() => {
                  setFromCurrency(currency);
                  setShowFromDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{currency}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>To Currency</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setShowToDropdown(!showToDropdown);
            setShowFromDropdown(false);
          }}
        >
          <Text style={styles.dropdownText}>{toCurrency || 'Select currency'}</Text>
          <Ionicons name="chevron-down" size={20} color="#6A1B9A" />
        </TouchableOpacity>
        {showToDropdown && (
          <View style={styles.dropdownList}>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency}
                style={styles.dropdownItem}
                onPress={() => {
                  setToCurrency(currency);
                  setShowToDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{currency}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <PrimaryButton label="Convert" onPress={handleConvert} />

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>
              Rate: 1 {result.fromCurrency} = {parseFloat(result.rate).toFixed(2)} {result.toCurrency}
            </Text>
            <Text style={styles.resultText}>
              {result.amount} {result.fromCurrency} = {parseFloat(result.convertedAmount).toFixed(2)} {result.toCurrency}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F4E8FF',
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    width: '100%',
    paddingVertical: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 30,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 5,
    minHeight: 500,
    marginTop: -40,
  },
  inputField: {
    backgroundColor: '#F3E5F5', // 👈 MATCHING "From Currency" color
    borderColor: '#BA68C8',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    padding: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6A1B9A',
    marginTop: 12,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BA68C8',
    marginBottom: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#4A148C',
    fontWeight: '500',
  },
  dropdownList: {
    backgroundColor: '#F8EAF6',
    borderRadius: 10,
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownItemText: {
    color: '#6A1B9A',
    fontSize: 15,
    fontWeight: '500',
  },
  resultCard: {
    backgroundColor: '#E1BEE7',
    marginTop: 30,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  resultText: {
    color: '#4A148C',
    fontSize: 17,
    fontWeight: '600',
    marginVertical: 4,
  },
});

export default CurrencyConverter;
