import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import PrimaryButton from '../components/PrimaryButton';
import InputField from '../components/InputField';

  const currencies = ['USD', 'EUR', 'PKR', 'GBP'];

  const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('PKR');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [result, setResult] = useState(null);

  const handleConvert = async () => {
    console.log("Convert button pressed");
  
    if (!amount || !fromCurrency || !toCurrency) {
      Alert.alert('Validation Error', 'Please provide amount, fromCurrency, and toCurrency');
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
  
      console.log("🚀 Backend responded with:", JSON.stringify(response.data, null, 2)); // 👈 Add this line
      setResult(response.data);
    } catch (error) {
      console.error("Conversion error:", error);
      Alert.alert('Conversion Failed', error.response?.data?.error || error.message);
    }
  };
  
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Currency Converter</Text>

        <InputField
          placeholder="Enter amount"
          iconName="money"
          value={amount}
          onChangeText={setAmount}
        />

        {/* From Currency */}
        <Text style={styles.label}>From Currency:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setShowFromDropdown(!showFromDropdown);
            setShowToDropdown(false); // Close the other dropdown
          }}
        >
          <Text>{fromCurrency}</Text>
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
                <Text>{currency}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* To Currency */}
        <Text style={styles.label}>To Currency:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setShowToDropdown(!showToDropdown);
            setShowFromDropdown(false); // Close the other dropdown
          }}
        >
          <Text>{toCurrency}</Text>
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
                <Text>{currency}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

<PrimaryButton label="Convert" onPress={handleConvert} />



        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.label}>Exchange Rate: {result.rate}</Text>
            <Text style={styles.label}>
              {result.amount} {result.fromCurrency} = {result.convertedAmount} {result.toCurrency}
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
    backgroundColor: '#E5D4ED',
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#F4E8FF',
    margin: 20,
    borderRadius: 15,
    elevation: 4,
    width: '90%',
    minHeight: 600,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#E0D3F5',
  },
  dropdownList: {
    backgroundColor: '#E0D3F5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  resultContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#E0D3F5',
    borderRadius: 10,
  },
});

export default CurrencyConverter;
