// frontend/components/TaskList.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Task {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: boolean;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Meeting with Client', description: 'Discuss project details', dateTime: '2024-07-01 10:00 AM', deadline: '2024-07-02', priority: true },
  { id: '2', title: 'Submit Report', description: 'Submit monthly report', dateTime: '2024-07-01 12:00 PM', deadline: '2024-07-03', priority: false },
  { id: '3', title: 'Design Review', description: 'Review the UI/UX design', dateTime: '2024-07-02 02:00 PM', deadline: '2024-07-04', priority: false },
  { id: '4', title: 'Code Review', description: 'Check latest PRs', dateTime: '2024-07-03 03:00 PM', deadline: '2024-07-05', priority: true },
  { id: '5', title: 'Team Meeting', description: 'Weekly team meeting', dateTime: '2024-07-04 11:00 AM', deadline: '2024-07-06', priority: false },
  { id: '6', title: 'Update Documentation', description: 'Update API docs', dateTime: '2024-07-05 05:00 PM', deadline: '2024-07-07', priority: false },
  { id: '7', title: 'Client Follow-up', description: 'Email the client for updates', dateTime: '2024-07-06 09:00 AM', deadline: '2024-07-08', priority: true },
];

const TaskList = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={[styles.taskItem, item.priority && styles.priorityTask]}>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <Text style={styles.taskDateTime}>📅 {item.dateTime}</Text>
        <Text style={styles.taskDeadline}>⏳ Deadline: {item.deadline}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderTaskItem}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: '#e0ffe0',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  priorityTask: {
    backgroundColor: '#ffcccc',
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  taskDateTime: {
    fontSize: 12,
    color: '#888',
  },
  taskDeadline: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d9534f',
  },
});

export default TaskList;
