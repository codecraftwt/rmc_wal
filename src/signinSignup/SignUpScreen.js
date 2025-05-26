import React, {useState,useEffect} from 'react';
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
  BackHandler
} from 'react-native';
import {h, w, f} from 'walstar-rn-responsive';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
      const backAction = () => {
        navigation.goBack(); 
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
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
    navigation.replace('MainTabs');
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
              <Text style={styles.title}>Create Your Account</Text>
              <Text style={styles.subtitle}>Join us to get started</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Icon name="person-outline" size={f(2.5)} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="at-outline" size={f(2.5)} style={styles.icon} />
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

              <View style={styles.inputContainer}>
                <Icon
                  name="lock-closed-outline"
                  size={f(2.5)}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#888"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}>
                  <Icon
                    name={
                      showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                    }
                    size={f(2.5)}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}> Log In</Text>
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
    marginTop: h(5),
    marginBottom: h(4),
    marginTop: h(10),
  },
  logo: {
    width: w(30),
    height: h(15),
    marginBottom: h(2),
  },
  title: {
    fontSize: f(3.5),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: h(0.5),
  },
  subtitle: {
    fontSize: f(2),
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: h(4),
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
});

export default SignUpScreen;
