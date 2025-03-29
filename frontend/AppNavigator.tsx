//AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from '../frontend/screens/SignUp';
import SignIn from '../frontend/screens/SignIn';
import Home from '../frontend/components/Home';
import { useAuthStore } from './storage/authStore';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { isAuthenticated, restoreAuth } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      await restoreAuth();
      setIsAuthChecked(true);
    };
    checkAuth();
  }, []);

  if (!isAuthChecked) {
    return null; // Prevent rendering until auth state is checked
  }

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "SignIn"}>
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
