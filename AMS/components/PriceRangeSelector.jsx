import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const PriceRangeSelector = ({ priceRange = [0, 1000], setPriceRange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Price Range</Text>

      {/* Display selected range */}
      <Text style={styles.rangeText}>$ {priceRange[0]} - $ {priceRange[1]}</Text>

      {/* MultiSlider for min and max price */}
      <MultiSlider
        values={priceRange}
        onValuesChange={setPriceRange}
        min={0}
        max={1000}
        step={10}
        selectedStyle={{ backgroundColor: '#B892FF' }}  // Light purple
        unselectedStyle={{ backgroundColor: '#E0CFFD' }}  // Softer purple or light gray
        markerStyle={{
          backgroundColor: '#A974FF',
          height: 25,
          width: 25,
          borderRadius: 15,
        }}
        trackStyle={{
          height: 4,
        }}
        style={styles.slider} // Adjust the length of the slider here
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  rangeText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444',
  },
  slider: {
    width: '100%', 
    height: 40,
    borderRadius: 10, 
    marginBottom: 15, 
  },
});

export default PriceRangeSelector;
