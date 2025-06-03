import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import {h, w, f} from 'walstar-rn-responsive';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../../Redux/slices/authSlice';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const {loading, error, user, token} = useSelector(state => state.auth);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Validation', 'Please enter both email and password.');
      return;
    }

    const payload = {
      email: username,
      password: password,
    };

    dispatch(loginUser(payload))
      .unwrap()
      .then(res => {
        if (res.token) {
          navigation.replace('MainTabs');
        } else {
          Alert.alert('Login Failed', res.message || 'Invalid credentials');
        }
      })
      .catch(err => {
        console.error('Login failed:', err);
        Alert.alert('Login Failed', err || 'Invalid credentials');
      });
  };

  return (
    <>
      <View style={styles.statusBarContainer}>
        <LinearGradient
          colors={['#F7374F', '#FF6B6B']}
          style={styles.statusBarGradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
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
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Icon name="person-outline" size={f(2.5)} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#888"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon
                  name="lock-closed-outline"
                  size={f(2.5)}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}>
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={f(2.5)}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Log In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={styles.footerLink}> Sign Up</Text>
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
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    overflow: 'hidden',
  },
  statusBarGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: h(5),
  },
  header: {
    alignItems: 'center',
    marginTop: h(10),
    marginBottom: h(6),
  },
  logo: {
    width: w(30),
    height: h(15),
    marginBottom: h(3),
  },
  title: {
    fontSize: f(4),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: h(1),
  },
  subtitle: {
    fontSize: f(2.2),
    color: 'rgba(255,255,255,0.8)',
  },
  formContainer: {
    marginHorizontal: w(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: w(3),
    paddingHorizontal: w(4),
    marginBottom: h(2),
    height: h(6.5),
  },
  icon: {
    color: '#888',
    marginRight: w(3),
  },
  input: {
    flex: 1,
    fontSize: f(2),
    color: '#333',
    height: '100%',
  },
  eyeIcon: {
    padding: w(2),
  },
  button: {
    backgroundColor: 'white',
    borderRadius: w(3),
    height: h(6.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: h(2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: f(2.5),
    fontWeight: 'bold',
    color: '#F7374F',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: h(1.5),
  },
  forgotPasswordText: {
    color: 'white',
    fontSize: f(2),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: h(6),
  },
  footerText: {
    color: 'white',
    fontSize: f(2),
  },
  footerLink: {
    color: 'blue',
    fontSize: f(2.1),
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default LoginScreen;
