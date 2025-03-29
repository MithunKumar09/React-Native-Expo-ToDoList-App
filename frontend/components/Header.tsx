//frontend/components/Header.js
//frontend/components/Header.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../storage/authStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

const Header = () => {
  const { isAuthenticated, username, email, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            await logout(); // Call logout function
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              })
            ); // Reset navigation stack to SignIn screen
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>To Do List</Text>
      <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.profileContainer}>
        <MaterialIcons name="account-circle" size={40} color="#FFF" />
        <MaterialIcons name="arrow-drop-down" size={24} color="#FFF" />
      </TouchableOpacity>
      {showDropdown && isAuthenticated && (
        <View style={styles.dropdownMenu}>
          <Text style={styles.dropdownText}>{username}</Text>
          <Text style={styles.dropdownText}>{email}</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={20} color="#FFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1E1E1E',
    position: 'relative',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    right: 15,
    backgroundColor: '#2C2C2C',
    padding: 12,
    borderRadius: 12,
    width: 200, 
    elevation: 8,  
    zIndex: 1000,  
    borderWidth: 1,
    borderColor: '#555',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dropdownText: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FF4444',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default Header;
