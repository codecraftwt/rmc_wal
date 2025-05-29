import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  View,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
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
  const [billingExpanded, setBillingExpanded] = useState(false);
  const [shippingExpanded, setShippingExpanded] = useState(false);

  // Billing address state
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });

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

  const copyBillingToShipping = () => {
    setShippingAddress({...billingAddress});
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? h(6) : 0}
        style={styles.container}>
        <LinearGradient
          colors={['#F8FAFF', '#F0F4FF']}
          // style={styles.container}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <Header
            title="Add New Customer"
            navigation={navigation}
            showBackButton="arrow-back"
          />
          <ScrollView contentContainerStyle={styles.formContainer}>
            <View style={styles.section}>
              <Text style={styles.formTitle}>Customer Details</Text>
              <FormField
                icon="business-outline"
                label="Company"
                value={company}
                onChangeText={setCompany}
                required
              />
              <FormField
                icon="reader-outline"
                label="GST Number"
                value={gst}
                onChangeText={setGst}
              />
              <FormField
                icon="call"
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <FormField
                icon="location-outline"
                label="Address"
                value={address}
                onChangeText={setAddress}
                multiline
              />
              <FormField
                icon="location"
                label="City"
                value={city}
                onChangeText={setCity}
              />
              <FormField
                icon="pin-outline"
                label="State"
                value={state}
                onChangeText={setState}
              />
              <FormField
                icon="barcode-outline"
                label="Zip Code"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
              />
              <FormField
                icon="globe-outline"
                label="Country"
                value={country}
                onChangeText={setcountry}
              />
              <FormField
                icon="link"
                label="Website"
                value={website}
                onChangeText={setWebsite}
              />
              <FormField
                icon="people"
                label="Groups"
                value={groups}
                onChangeText={setGroups}
              />
            </View>

            {/* Billing and Shipping Address Section */}
            <View style={styles.section}>
              <Text style={styles.formTitle}>Billing & Shipping</Text>

              {/* Billing Address */}
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setBillingExpanded(!billingExpanded)}>
                <View style={styles.sectionHeaderContent}>
                  <Icon name="location-outline" size={f(2.5)} color="#F7374F" />
                  <Text style={styles.sectionTitle}>Billing Address</Text>
                </View>
                <Icon
                  name={billingExpanded ? 'chevron-up' : 'chevron-down'}
                  size={f(2.5)}
                  color="#F7374F"
                />
              </TouchableOpacity>

              {billingExpanded && (
                <View style={styles.addressSection}>
                  <FormField
                    icon="home-outline"
                    label="Street"
                    value={billingAddress.street}
                    onChangeText={text =>
                      setBillingAddress({...billingAddress, street: text})
                    }
                    multiline
                  />
                  <FormField
                    icon="location"
                    label="City"
                    value={billingAddress.city}
                    onChangeText={text =>
                      setBillingAddress({...billingAddress, city: text})
                    }
                  />
                  <FormField
                    icon="map"
                    label="State"
                    value={billingAddress.state}
                    onChangeText={text =>
                      setBillingAddress({...billingAddress, state: text})
                    }
                  />
                  <FormField
                    icon="flag"
                    label="Country"
                    value={billingAddress.country}
                    onChangeText={text =>
                      setBillingAddress({...billingAddress, country: text})
                    }
                  />
                  <FormField
                    icon="code"
                    label="Zip Code"
                    value={billingAddress.zipCode}
                    onChangeText={text =>
                      setBillingAddress({...billingAddress, zipCode: text})
                    }
                    keyboardType="numeric"
                  />
                </View>
              )}

              {/* Shipping Address */}
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setShippingExpanded(!shippingExpanded)}>
                <View style={styles.sectionHeaderContent}>
                  <Icon name="cube-outline" size={f(2.5)} color="#F7374F" />
                  <Text style={styles.sectionTitle}>Shipping Address</Text>
                </View>
                <Icon
                  name={shippingExpanded ? 'chevron-up' : 'chevron-down'}
                  size={f(2.5)}
                  color="#F7374F"
                />
              </TouchableOpacity>

              {shippingExpanded && (
                <View style={styles.addressSection}>
                  <TouchableOpacity
                    style={styles.sameAsBillingButton}
                    onPress={copyBillingToShipping}>
                    <Icon name="copy-outline" size={f(2)} color="#4CAF50" />
                    <Text style={styles.sameAsBillingText}>
                      Same as Billing Address
                    </Text>
                  </TouchableOpacity>

                  <FormField
                    icon="home-outline"
                    label="Street"
                    value={shippingAddress.street}
                    onChangeText={text =>
                      setShippingAddress({...shippingAddress, street: text})
                    }
                    multiline
                  />
                  <FormField
                    icon="location"
                    label="City"
                    value={shippingAddress.city}
                    onChangeText={text =>
                      setShippingAddress({...shippingAddress, city: text})
                    }
                  />
                  <FormField
                    icon="map"
                    label="State"
                    value={shippingAddress.state}
                    onChangeText={text =>
                      setShippingAddress({...shippingAddress, state: text})
                    }
                  />
                  <FormField
                    icon="flag"
                    label="Country"
                    value={shippingAddress.country}
                    onChangeText={text =>
                      setShippingAddress({...shippingAddress, country: text})
                    }
                  />
                  <FormField
                    icon="code"
                    label="Zip Code"
                    value={shippingAddress.zipCode}
                    onChangeText={text =>
                      setShippingAddress({...shippingAddress, zipCode: text})
                    }
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>

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
      </KeyboardAvoidingView>
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
      <Icon
        name={icon}
        size={f(2.5)}
        color="#F7374F"
        style={styles.fieldIcon}
      />
      <Text style={styles.labelText}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
    </View>
    <View style={styles.inputContainer}>
      {unit && <Text style={styles.unitText}>{unit}</Text>}
      <TextInput
        style={[styles.input, unit && {paddingLeft: w(8)}]}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  formTitle: {
    fontSize: f(2.4),
    color: 'black',
    fontWeight: '600',
    marginBottom: h(2),
    fontFamily: 'Poppins-SemiBold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: w(3),
    padding: w(4),
    marginBottom: h(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: h(1),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: f(2.2),
    color: '#333',
    marginLeft: w(2),
    fontFamily: 'Poppins-Medium',
  },
  addressSection: {
    paddingTop: h(2),
  },
  sameAsBillingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: w(3),
    borderRadius: w(2),
    marginBottom: h(2),
  },
  sameAsBillingText: {
    color: '#4CAF50',
    marginLeft: w(2),
    fontSize: f(2),
    fontFamily: 'Poppins-Medium',
  },
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
    backgroundColor: '#F5F7FA',
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
    borderRadius: w(2),
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom:h(14.4)
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
    fontFamily: 'Poppins-SemiBold',
    marginRight: w(2),
  },
  submitIcon: {
    marginLeft: w(1),
  },
});

export default AddCustomers;
