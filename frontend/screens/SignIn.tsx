//frontend/screens/SignIn.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../storage/authStore';
import api from '../constants/axiosInstance';

type RootStackParamList = {
    SignUp: undefined;
    SignIn: undefined;
    Home: undefined;
};

const SignIn: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore.getState();

    const validateForm = () => {
        let valid = true;
        const newErrors = { email: '', password: '' };

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
            valid = false;
        }

        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            console.log('(NOBRIDGE) LOG  Attempting to log in with:', { email, password });

            const response = await api.post('/auth/login', { email, password });
            console.log('(NOBRIDGE) LOG  Login response:', response.data);

            if (response.data.success) {
                const { accessToken, refreshToken, username, email: userEmail } = response.data;

                if (!accessToken || !refreshToken) {
                    console.error('(NOBRIDGE) LOG  Missing accessToken or refreshToken in response:', response.data);
                    Alert.alert('Login Error', 'Invalid credentials received.');
                    return;
                }

                console.log('(NOBRIDGE) LOG  Received tokens:', { accessToken, refreshToken, username, email: userEmail });

                // Ensure `setAuth` correctly updates state
                setAuth({
                    token: accessToken,
                    refreshToken,
                    username,
                    email: userEmail
                });

                console.log('(NOBRIDGE) LOG  setAuth called with:', {
                    token: accessToken,
                    refreshToken,
                    username,
                    email: userEmail
                });

                await new Promise(resolve => setTimeout(resolve, 100));

                // Verify authentication state update
                const authState = useAuthStore.getState();
                console.log('(NOBRIDGE) LOG  Updated Auth State:', authState);

                if (authState.isAuthenticated) {
                    Alert.alert('Login Successful');
                    navigation.navigate('Home');
                } else {
                    console.error('(NOBRIDGE) LOG  Authentication failed post state update');
                    Alert.alert('Login Failed', 'Authentication issue. Please try again.');
                }
            } else {
                console.error('(NOBRIDGE) LOG  Login failed:', response.data);
                Alert.alert('Login Failed', response.data.message || 'Invalid credentials.');
            }
        } catch (error: unknown) {
            console.error('(NOBRIDGE) LOG  Login error:', error);
            Alert.alert('Login Failed', 'An unexpected error occurred.');
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <ImageBackground 
        source={require('../assets/images/bg.jpg')} 
        style={styles.background}
        resizeMode="cover"
    >
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Text style={styles.title}>Sign In</Text>
            <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

            <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                Don't have an account? <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
                    Sign up</Text>
            </Text>
        </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.50)',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerText: {
        textAlign: 'center',
        marginTop: 20,
    },
    link: {
        color: '#007bff',
        textDecorationLine: 'underline',
    },
});

export default SignIn;
