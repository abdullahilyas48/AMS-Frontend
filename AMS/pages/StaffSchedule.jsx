import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, FlatList, Dimensions, ImageBackground
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function StaffSchedule({ navigation }) {
  const [duties, setDuties] = useState([]);
  const [frequency, setFrequency] = useState('');
  const [staffName, setStaffName] = useState('');

  const fetchDuties = async () => {
    try {
      const params = {};
      if (frequency) params.frequency = frequency;
      if (staffName) params.staffName = staffName;

      const res = await axios.get('http://192.168.1.7:7798/duties', { params });
      setDuties(res.data.message ? [] : res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDuties();
  }, [frequency, staffName]);

  const clearFilters = () => {
    setFrequency('');
    setStaffName('');
    fetchDuties();
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{new Date(item.date).toDateString()}</Text>
      <Text style={styles.tableCell}>{item.time}</Text>
      <Text style={styles.tableCell}>{item.staffName}</Text>
      <Text style={styles.tableCell}>{item.taskName}</Text>
      <Text style={styles.tableCell}>{item.frequency}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/AdminBg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.overlayBackground} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Staff Schedule</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.content}>
          {/* Filter Inputs */}
          <View style={styles.filterContainer}>
            <TextInput
              style={styles.input}
              placeholder="Frequency (daily, weekly, monthly)"
              value={frequency}
              onChangeText={text => setFrequency(text.toLowerCase())}
              placeholderTextColor="#555"
            />
            <TextInput
              style={styles.input}
              placeholder="Staff Name"
              value={staffName}
              onChangeText={text => setStaffName(text)}
              placeholderTextColor="#555"
            />
            {(frequency || staffName) && (
              <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
                <Ionicons name="close-circle" size={28} color="#8d56aa" />
              </TouchableOpacity>
            )}
          </View>

          {/* Table */}
          {duties.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noData}>No duties found</Text>
            </View>
          ) : (
            <ScrollView horizontal={true} style={styles.tableScroll}>
              <View>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={styles.headerCell}>Date</Text>
                  <Text style={styles.headerCell}>Time</Text>
                  <Text style={styles.headerCell}>Staff</Text>
                  <Text style={styles.headerCell}>Task</Text>
                  <Text style={styles.headerCell}>Frequency</Text>
                </View>

                {/* Table Body */}
                <FlatList
                  data={duties}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');
const cellWidth = width * 0.3;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8d56aa',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerPlaceholder: {
    width: 30,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  filterContainer: {
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ffffffee',
    borderRadius: 10,
    padding: 12,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    color: '#000',
    fontWeight: '600',
  },
  clearButton: {
    marginLeft: 5,
  },
  tableScroll: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#6e3b84',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal: 15,
  },
  headerCell: {
    width: cellWidth,
    padding: 12,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffffdd',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 15,
  },
  tableCell: {
    width: cellWidth,
    padding: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    color: '#fff',
    fontSize: 16,
  },
});
