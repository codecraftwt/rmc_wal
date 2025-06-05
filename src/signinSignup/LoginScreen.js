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
  const { loading, error, user, token } = useSelector(state => state.auth);

  // useEffect(() => {
  //   const backAction = () => {
  //     navigation.goBack();
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, [navigation]);

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
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.formContainer}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>

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
                  editable={!loading}
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
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={loading}>
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={f(2.5)}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => navigation.navigate('SignUpScreen')}
                disabled={loading}>
                <Text style={styles.signUpText}>
                  Don't have an account? <Text style={styles.signUpTextBold}>Sign Up</Text>
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
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: f(2.2),
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: h(4),
    fontFamily: 'Poppins-Regular',
    alignSelf: 'center',
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
  loginButton: {
    backgroundColor: '#FFF',
    borderRadius: w(2),
    paddingVertical: Platform.OS === 'ios' ? h(1.5) : h(1.2),
    alignItems: 'center',
    marginTop: h(2),
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#F7374F',
    fontSize: f(2.2),
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  signUpButton: {
    marginTop: h(3),
    alignItems: 'center',
  },
  signUpText: {
    color: '#FFF',
    fontSize: f(2),
    fontFamily: 'Poppins-Regular',
  },
  signUpTextBold: {
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default LoginScreen;
