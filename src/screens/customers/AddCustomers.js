import React, {useState,useEffect} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  View,
  Alert,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {h, w, f} from 'walstar-rn-responsive';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';

const AddCustomers = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [company, setCompany] = useState('');
  const [gst, setGst] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setcountry] = useState('');
  const [website, setWebsite] = useState('');
  const [groups, setGroups] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!company) {
      Alert.alert('Validation Error', 'Please fill required fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Customer added successfully!');
      navigation.goBack();
    }, 1500);
  };

 useEffect(() => {
     const backAction = () => {
       navigation.navigate('MainTabs');
       return true;
     };
     const backHandler = BackHandler.addEventListener(
       'hardwareBackPress',
       backAction,
     );
     return () => backHandler.remove();
   }, [navigation]);

  return (
    <>
      <LinearGradient
        colors={['#F7374F', '#FF6B6B']}
        style={styles.statusBarArea}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <SafeAreaView edges={['top']} style={styles.statusBarAreaInner} />
      </LinearGradient>

      <LinearGradient
        colors={['#F8FAFF', '#F0F4FF']}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <Header
          title="Add New Customer"
          navigation={navigation}
          showBackButton="arrow-back"
        />

        <ScrollView contentContainerStyle={styles.formContainer}>
           <FormField
            icon="people"
            label="Company"
            value={company}
            // onChangeText={text => handleChange('customer_name', text)}
            required
          />
           <FormField
            icon="radio-button-on-outline"
            label="GST Number"
            value={gst}
            // onChangeText={text => handleChange('customer_name', text)}
          />
           <FormField
            icon="call"
            label="Phone"
            value={phone}
            // onChangeText={text => handleChange('customer_name', text)}
          />
           <FormField
            icon="location-outline"
            label="Address"
            value={address}
            // onChangeText={text => handleChange('customer_name', text)}
          />
           <FormField
            icon="location"
            label="City"
            value={city}
            // onChangeText={text => handleChange('customer_name', text)}
          />
           <FormField
            icon="map"
            label="State"
            value={state}
            // onChangeText={text => handleChange('customer_name', text)}
          />
           <FormField
            icon="code"
            label="Zip Code"
            value={zipCode}
            // onChangeText={text => handleChange('customer_name', text)}
          />
           <FormField
            icon="flag"
            label="Country"
            value={country}
            // onChangeText={text => handleChange('customer_name', text)}
          />
           <FormField
            icon="link"
            label="Website"
            value={website}
            // onChangeText={text => handleChange('customer_name', text)}
          />
           <FormField
            icon="people"
            label="Groups"
            value={groups}
            // onChangeText={text => handleChange('customer_name', text)}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}>
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              style={styles.submitGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Create Customer</Text>
                  <Icon
                    name="checkmark"
                    size={f(2.5)}
                    color="white"
                    style={styles.submitIcon}
                  />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </>
  );
};
const FormField = ({
  icon,
  label,
  value,
  onChangeText,
  required = false,
  unit = null,
  ...props
}) => (
  <View style={styles.fieldContainer}>
    <View style={styles.fieldLabel}>
      <Icon name={icon} size={f(2.5)} color="#F7374F" style={styles.fieldIcon} />
      <Text style={styles.labelText}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
    </View>
    <View style={styles.inputContainer}>
      {unit && <Text style={styles.unitText}>{unit}</Text>}
      <TextInput
        style={[styles.input, unit && { paddingLeft: w(8) }]}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  </View>
);
const styles = StyleSheet.create({
    fieldContainer: {
    marginBottom: h(2),
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(1),
  },
  fieldIcon: {
    marginRight: w(2),
  },
  labelText: {
    fontSize: f(2.1),
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
    required: {
    color: '#F7374F',
  },
    inputContainer: {
    position: 'relative',
  },
   unitText: {
    position: 'absolute',
    right: w(3),
    top: h(1.5),
    fontSize: f(2),
    color: 'black',
    zIndex: 1,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: w(2),
    padding: w(2.8),
    fontSize: f(2),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  statusBarArea: {
     height: h(2),
  },
  statusBarAreaInner: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    padding: w(5),
  },
  submitButton: {
    marginTop: h(2),
    borderRadius: 10,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: h(2),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: f(2.2),
    fontWeight: 'bold',
    marginRight: w(2),
  },
  submitIcon: {
    marginLeft: w(1),
  },
});

export default AddCustomers;
