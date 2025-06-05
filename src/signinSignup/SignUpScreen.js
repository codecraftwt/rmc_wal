import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { h, w, f } from 'walstar-rn-responsive';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleSignUp = () => {
    if (!name || !username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setIsLoading(true);
    navigation.replace('MainTabs');
  };

  return (
    <>
      <View style={styles.statusBarContainer}>
        <LinearGradient
          colors={['#F7374F', '#FF6B6B']}
          style={styles.statusBarGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
        </LinearGradient>
      </View>

      <LinearGradient
        colors={['#F7374F', '#FF6B6B']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.formContainer}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join us to get started</Text>

              <View style={styles.inputContainer}>
                <Icon name="person-outline" size={f(2.5)} color="#FFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="mail-outline" size={f(2.5)} color="#FFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={username}
                  onChangeText={setUsername}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock-closed-outline" size={f(2.5)} color="#FFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={isLoading}>
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={f(2.5)}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock-closed-outline" size={f(2.5)} color="#FFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                  disabled={isLoading}>
                  <Icon
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={f(2.5)}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                onPress={handleSignUp}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.signUpButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('Login')}
                disabled={isLoading}>
                <Text style={styles.loginText}>
                  Already have an account? <Text style={styles.loginTextBold}>Log In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  statusBarContainer: {
    height: h(2),
  },
  statusBarGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: w(5),
  },
  title: {
    fontSize: f(4),
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: h(1),
    fontFamily: 'Poppins-Bold',
    alignSelf: "center"
  },
  subtitle: {
    fontSize: f(2.2),
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: h(4),
    fontFamily: 'Poppins-Regular',
    alignSelf: "center"
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: w(2),
    marginBottom: h(2),
    paddingHorizontal: w(4),
  },
  inputIcon: {
    marginRight: w(3),
  },
  input: {
    flex: 1,
    height: Platform.OS === 'ios' ? h(6) : h(5),
    color: '#FFF',
    fontSize: f(2),
    fontFamily: 'Poppins-Regular',
  },
  eyeIcon: {
    padding: w(1),
  },
  signUpButton: {
    backgroundColor: '#FFF',
    borderRadius: w(2),
    paddingVertical: Platform.OS === 'ios' ? h(1.5) : h(1.2),
    alignItems: 'center',
    marginTop: h(2),
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: '#F7374F',
    fontSize: f(2.2),
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  loginButton: {
    marginTop: h(3),
    alignItems: 'center',
  },
  loginText: {
    color: '#FFF',
    fontSize: f(2),
    fontFamily: 'Poppins-Regular',
  },
  loginTextBold: {
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default SignUpScreen;
