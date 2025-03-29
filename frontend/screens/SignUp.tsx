//frontend/screens/SignUp.tsx 
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../constants/axiosInstance';

type RootStackParamList = {
    SignUp: undefined;
    SignIn: undefined;
};

const Signup: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({ username: '', email: '', password: '', confirmPassword: '' });

    const validateForm = () => {
        let valid = true;
        const newErrors = { username: '', email: '', password: '', confirmPassword: '' };

        if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters long.';
            valid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
            valid = false;
        }

        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
            valid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            console.log('Form validation passed. Sending signup request...');
            // console.log('Request payload:', { username, email, password });

            try {
                const response = await api.post('/auth/signup', { username, email, password });

                console.log('Response received:', response.data);

                if (response.status === 201) {
                    Alert.alert('Success', 'Account created! Please log in.');
                    navigation.navigate('SignIn');
                } else {
                    Alert.alert('Error', response.data.message || 'Something went wrong');
                }
            } catch (error: any) {
                console.error('Signup error:', error);

                if (error.response) {
                    console.error('Error Response Data:', error.response.data);
                    Alert.alert('Error', error.response.data.message || 'Something went wrong');
                } else if (error.request) {
                    Alert.alert('Error', 'Network error. Please check your connection.');
                } else {
                    Alert.alert('Error', 'Unexpected error occurred.');
                }
            }
        } else {
            console.log('Form validation failed.');
        }
    };
    

    return (
                <ImageBackground 
                source={require('../assets/images/bg.jpg')} 
                style={styles.background}
                resizeMode="cover"
            >
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
            </View>
            {errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}

            <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
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
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Icon name={passwordVisible ? "eye" : "eye-slash"} size={20} color="#888" />
                </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

            <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!confirmPasswordVisible}
                />
                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                    <Icon name={confirmPasswordVisible ? "eye" : "eye-slash"} size={20} color="#888" />
                </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}>
                    Log in
                </Text>
            </Text>
        </View>
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

export default Signup;