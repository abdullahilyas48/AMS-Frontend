import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  ScrollView, FlatList, Dimensions
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
    <View style={styles.container}>
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
          />
          <TextInput
            style={styles.input}
            placeholder="Staff Name"
            value={staffName}
            onChangeText={text => setStaffName(text)}
          />
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
  );
}

const { width } = Dimensions.get('window');
const cellWidth = width * 0.3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  content: {
    flex: 1,
    backgroundColor: '#e9d4f4', 
    paddingBottom: 20,
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
  filterContainer: {
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e9d4f4', 
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tableScroll: {
    flex: 1,
    backgroundColor: '#e9d4f4', 
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#9c64b5', 
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 15,
  },
  tableCell: {
    width: cellWidth,
    padding: 12,
    textAlign: 'center',
    backgroundColor: '#fff', 
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9d4f4', 
  },
  noData: {
    color: '#888',
    fontSize: 16,
  },
});