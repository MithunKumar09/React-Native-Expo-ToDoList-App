// frontend/components/AddTaskButton.js
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import { useAuthStore } from '../storage/authStore';
import api from '../constants/axiosInstance';

const AddTaskButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const { isAuthenticated, username, email, token} = useAuthStore();

  const handleConfirmDate = (selectedDate) => {
    setDate(selectedDate);
    setDatePickerVisibility(false);
  };

  const handleConfirmTime = (selectedTime) => {
    setTime(selectedTime);
    setTimePickerVisibility(false);
  };

  const handleSubmit = async () => {
    if (!title || !description) {
        setError('All fields are required');
        return;
    }
    setLoading(true);

    if (!token) {
        setError('Authentication failed. Please log in again.');
        setLoading(false);
        return;
    }

    // Convert date to valid format
    const formattedDate = date.toISOString().split('T')[0]; // Extract YYYY-MM-DD

    // Convert time to proper 12-hour format with leading zeros
    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(time);

    try {
        console.log('📡 Sending request with headers:', {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
        console.log('📡 Sending request with data:', { title, description, date: formattedDate, time: formattedTime });

        await api.post(
            'tasks/',
            { title, description, date: formattedDate, time: formattedTime, status: 'Scheduled' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setModalVisible(false);
        setTitle('');
        setDescription('');
        setDate(new Date());
        setTime(new Date());
    } catch (err) {
        console.error('❌ API Error:', err);
        setError('Failed to add task');
    }

    setLoading(false);
};



  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Task</Text>
            <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
            <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />

            {/* Date Picker Button */}
            <TouchableOpacity style={styles.dateButton} onPress={() => setDatePickerVisibility(true)}>
              <Text style={styles.dateText}>📅 Select Date: {date.toDateString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={() => setDatePickerVisibility(false)} />

            {/* Time Picker Button */}
            <TouchableOpacity style={styles.dateButton} onPress={() => setTimePickerVisibility(true)}>
              <Text style={styles.dateText}>⏰ Select Time: {time.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" onConfirm={handleConfirmTime} onCancel={() => setTimePickerVisibility(false)} />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {loading ? <ActivityIndicator size="large" color="#4CAF50" /> : <Button title="Submit" onPress={handleSubmit} />}
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#4CAF50', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10, borderRadius: 5 },
  dateButton: { width: '100%', padding: 10, backgroundColor: '#ddd', borderRadius: 5, marginBottom: 10, alignItems: 'center' },
  dateText: { fontSize: 16, color: '#333' },
  error: { color: 'red', marginBottom: 10 }
});

export default AddTaskButton;
