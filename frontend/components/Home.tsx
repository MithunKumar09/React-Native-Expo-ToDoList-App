import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Import icons
import Header from './Header';
import AddTaskButton from './AddTaskButton';
import { useAuthStore } from '../storage/authStore';
import api from '../constants/axiosInstance';

const { width, height } = Dimensions.get('window');

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  date: string;
  time: string;
  createdAt: string;
}

const Home = () => {
  const [slideAnim] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState(0);
  const { isAuthenticated, token, restoreAuth, starredTasks, toggleStar } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    restoreAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const response = await api.get<Task[]>('tasks/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Fetched Tasks:', response.data);

      const allTasks = response.data;
      const { starredTasks } = useAuthStore.getState();

      const sortedTasks = allTasks
        .filter(task => task.status === 'Scheduled')
        .sort((a, b) => {
          const aStarred = starredTasks[a._id]?.starredTime || 0;
          const bStarred = starredTasks[b._id]?.starredTime || 0;

          if (aStarred !== bStarred) {
            return bStarred - aStarred; // Starred tasks first
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

      const sortedCompletedTasks = allTasks
        .filter(task => task.status === 'Completed')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setTasks(sortedTasks);
      setCompletedTasks(sortedCompletedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Failed to fetch tasks.');
    }
  };

  const handleCompleteTask = (taskId: string) => {
    Alert.alert(
      "Complete Task",
      "Are you sure you want to mark this task as Completed?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Complete",
          onPress: async () => {
            try {
              await api.patch(
                `tasks/${taskId}`,
                { status: "Completed" },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              fetchTasks(); // Refresh task list after update
            } catch (error) {
              console.error("Error updating task:", error);
              Alert.alert("Error", "Failed to update task.");
            }
          },
          style: "default",
        },
      ]
    );
  };
  

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await api.delete(`tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              fetchTasks(); // Refresh the task list after deletion
            } catch (error) {
              console.error("Error deleting task:", error);
              Alert.alert("Error", "Failed to delete task.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };
  

  const renderTaskItem = ({ item }: { item: Task }) => {
    const isStarred = starredTasks[item._id] || false;
    const textColor = isStarred ? '#fff' : '#333'; // Change text color if the task is starred
    const secondaryTextColor = isStarred ? '#fff' : '#666';
    const checkmarkColor = isStarred ? '#fff' : 'green';
  
    return (
      <View style={[styles.taskCard, isStarred && styles.starredTask]}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, { color: textColor }]}>{item.title}</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={18} color={isStarred ? "#fff" : "gray"} />
            <Text style={[styles.dateText, { color: secondaryTextColor }]}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <Text style={[styles.taskDescription, { color: secondaryTextColor }]}>{item.description}</Text>
  
        {/* Task Info Row */}
        <View style={styles.taskInfo}>
          <View style={styles.taskTime}>
            <Ionicons name="time-outline" size={18} color={isStarred ? "#fff" : "gray"} />
            <Text style={[styles.timeText, { color: secondaryTextColor }]}>
              {new Date(item.time).toLocaleTimeString()}
            </Text>
          </View>
          <Text style={[styles.statusText, { color: isStarred ? '#fff' : '#4CAF50' }]}>{item.status}</Text>
        </View>
  
        {/* Action Icons */}
        <View style={styles.iconsContainer}>
        {activeTab === 0 && (
          <TouchableOpacity onPress={() => handleCompleteTask(item._id)}>
            <Ionicons name="checkmark-done-circle" size={24} color={checkmarkColor} />
          </TouchableOpacity>
        )}
          <TouchableOpacity onPress={() => handleDeleteTask(item._id)}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleStar(item._id, fetchTasks)}>
            <Ionicons name="star" size={24} color={isStarred ? "#FFD700" : "grey"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusBarGap} />
      <Header />

      {/* Tab Navigation */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.arrow} onPress={() => setActiveTab(0)} disabled={activeTab === 0}>
          <Ionicons name="arrow-back-circle" size={40} color={activeTab === 0 ? "gray" : "green"} />
        </TouchableOpacity>

        <Text style={styles.tabTitle}>{activeTab === 0 ? "Tasks List" : "Completed Tasks"}</Text>

        <TouchableOpacity style={styles.arrow} onPress={() => setActiveTab(1)} disabled={activeTab === 1}>
          <Ionicons name="arrow-forward-circle" size={40} color={activeTab === 1 ? "gray" : "green"} />
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <FlatList
        data={activeTab === 0 ? tasks : completedTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.taskList}
      />

      <AddTaskButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarGap: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: 'green',
    backgroundColor: '#f0f0f0',
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  arrow: {
    padding: 10,
  },
  taskList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderColor: '#4CAF50',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  taskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  taskTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  
  dateText: {
    marginLeft: 5,
    fontSize: 14,
    color: 'gray',
  },  
  starredTask: { backgroundColor: '#64a261' },
});

export default Home;
