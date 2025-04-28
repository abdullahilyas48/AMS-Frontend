import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutModal({ visible, onLogout, onCancel }) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData', 'tokenExpiry']);
      if (onLogout) onLogout();
      
      console.log('Logout successful - all auth data cleared');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalWrapper}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>LOGOUT</Text>
          <Text style={styles.subtitle}>Are you sure you want to logout?</Text>
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000066',
  },
  modalBox: {
    backgroundColor: '#f0aadb',
    padding: 40,  
    borderRadius: 20,  
    alignItems: 'center',
    width: '70%',  
    minWidth: 300,  
    height: 300,  
    justifyContent: 'center',  
  },
  title: {
    fontSize: 28,  
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,  
    marginBottom: 25,
  },
  logoutBtn: {
    backgroundColor: '#d966d9',
    paddingVertical: 15,
    paddingHorizontal: 50,  
    borderRadius: 15,
    marginBottom: 20,
  },
  logoutText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,  
  },
  cancelText: {
    color: '#000',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
