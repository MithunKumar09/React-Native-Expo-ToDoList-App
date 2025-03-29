//frontend/components/TaskItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TaskItem = ({ task, onDelete }: { task: any; onDelete: () => void }) => {
  return (
    <Animated.View style={styles.taskContainer}>
      <View>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDescription}>{task.description}</Text>
        <Text style={styles.taskDeadline}>Deadline: {task.deadline}</Text>
      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={onDelete}>
          <Icon name="delete" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="arrow-forward" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2E2E2E',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  taskDescription: { fontSize: 14, color: '#B0B0B0' },
  taskDeadline: { fontSize: 12, color: '#FFD700' },
  icons: { flexDirection: 'row', gap: 10 }
});

export default TaskItem;
