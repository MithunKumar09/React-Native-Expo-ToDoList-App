// frontend/components/CompletedTasks.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CompletedTasksProps {
  onSlide: () => void;
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ onSlide }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks</Text>
      <TouchableOpacity onPress={onSlide} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="blue" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default CompletedTasks;
