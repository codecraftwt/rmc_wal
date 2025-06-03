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
  TouchableNativeFeedback,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {h, w, f} from 'walstar-rn-responsive';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchCustomerFormData,
  addCustomer,
  resetAddCustomerState,
} from '../../../Redux/slices/orderSlice';

const CustomDropdown = ({
  value,
  onValueChange,
  items,
  placeholder,
  loading,
  style,
  getLabel = item => item.long_name,
  getValue = item => item.country_id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items || []);

  useEffect(() => {
    if (value && items) {
      const selectedItem = items.find(item => getValue(item) === value);
      setSelectedLabel(selectedItem ? getLabel(selectedItem) : placeholder);
    } else {
      setSelectedLabel(placeholder);
    }
  }, [value, items, placeholder, getLabel, getValue]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items || []);
    } else {
      const filtered = (items || []).filter(item =>
        getLabel(item).toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items, getLabel]);

  const handleSelect = item => {
    onValueChange(getValue(item));
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <View style={[styles.customDropdownContainer, style]}>
      <TouchableOpacity
        style={styles.customDropdownButton}
        onPress={() => setIsOpen(true)}>
        <Text style={styles.customDropdownButtonText}>{selectedLabel}</Text>
        <Icon name="chevron-down" size={f(2.5)} color="#F7374F" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownContent}>
                <LinearGradient
                  colors={['#F7374F', '#FF6B6B']}
                  style={styles.dropdownHeader}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <Text style={styles.dropdownTitle}>{placeholder}</Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeButton}>
                    <Icon name="close" size={f(2.5)} color="#FFFFFF" />
                  </TouchableOpacity>
                </LinearGradient>

                <View style={styles.searchContainer}>
                  <View style={styles.searchInputContainer}>
                    <Icon
                      name="search"
                      size={f(2.5)}
                      color="#666"
                      style={styles.searchIcon}
                    />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholderTextColor="#999"
                    />
                    {searchQuery ? (
                      <TouchableOpacity
                        onPress={() => setSearchQuery('')}
                        style={styles.clearSearchButton}>
                        <Icon name="close-circle" size={f(2.5)} color="#666" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#F7374F" />
                  </View>
                ) : (
                  <ScrollView style={styles.dropdownList}>
                    {filteredItems.length > 0 ? (
                      filteredItems.map(item => (
                        <TouchableOpacity
                          key={getValue(item)}
                          style={[
                            styles.dropdownItem,
                            value === getValue(item) &&
                              styles.dropdownItemSelected,
                          ]}
                          onPress={() => handleSelect(item)}>
                          <Text
                            style={[
                              styles.dropdownItemText,
                              value === getValue(item) &&
                                styles.dropdownItemTextSelected,
                            ]}>
                            {getLabel(item)}
                          </Text>
                          {value === getValue(item) && (
                            <Icon
                              name="checkmark"
                              size={f(2.5)}
                              color="#F7374F"
                            />
                          )}
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.noResultsContainer}>
                        <Icon name="search-outline" size={f(5)} color="#999" />
                        <Text style={styles.noResultsText}>
                          No results found
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const AddCustomers = ({navigation}) => {
  const dispatch = useDispatch();
  const {customerFormData = {}, customerFormDataLoading} = useSelector(
    state => state.order,
  );
  const {addCustomerLoading, addCustomerSuccess, addCustomerError} =
    useSelector(state => state.order);
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
  const [currency, setCurrency] = useState('');
  const [language, setLanguage] = useState('');
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

    if (addCustomerLoading) {
      return;
    }

    const customerData = {
      company,
      vat: gst,
      phonenumber: phone,
      country,
      city,
      zip: zipCode,
      state,
      address,
      website,
      default_currency: currency,
      default_language: language,
      billing_street: billingAddress.street,
      billing_city: billingAddress.city,
      billing_state: billingAddress.state,
      billing_zip: billingAddress.zipCode,
      billing_country: billingAddress.country,
      shipping_street: shippingAddress.street,
      shipping_city: shippingAddress.city,
      shipping_state: shippingAddress.state,
      shipping_zip: shippingAddress.zipCode,
      shipping_country: shippingAddress.country,
      groups_in: groups ? [groups] : [],
    };

    dispatch(addCustomer(customerData));
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

  useEffect(() => {
    dispatch(fetchCustomerFormData());
  }, [dispatch]);

  useEffect(() => {
    if (addCustomerSuccess) {
      Alert.alert('Success', 'Customer added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            dispatch(resetAddCustomerState());
            navigation.goBack();
          },
        },
      ]);
    }

    if (addCustomerError) {
      let errorMessage = '';
      
      if (addCustomerError.errors) {
        errorMessage = Object.entries(addCustomerError.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n\n');
      } else {
        errorMessage = addCustomerError.toString();
      }

      Alert.alert('Validation Error', errorMessage, [
        {
          text: 'OK',
          onPress: () => {
            dispatch(resetAddCustomerState());
          },
        },
      ]);
    }
  }, [addCustomerSuccess, addCustomerError]);

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
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabel}>
                  <Icon
                    name="globe-outline"
                    size={f(2.5)}
                    color="#F7374F"
                    style={styles.fieldIcon}
                  />
                  <Text style={styles.labelText}>Country</Text>
                </View>
                <CustomDropdown
                  value={country}
                  onValueChange={setcountry}
                  items={customerFormData?.countries || []}
                  placeholder="Select a country"
                  loading={customerFormDataLoading}
                  style={styles.pickerContainer}
                  getLabel={item => item.long_name} //how to display each item means display by name
                  getValue={item => item.country_id}//what value to return on selection means save id
                />
              </View>
              <FormField
                icon="link"
                label="Website"
                value={website}
                onChangeText={setWebsite}
              />
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabel}>
                  <Icon
                    name="people"
                    size={f(2.5)}
                    color="#F7374F"
                    style={styles.fieldIcon}
                  />
                  <Text style={styles.labelText}>Groups</Text>
                </View>
                <CustomDropdown
                  value={groups}
                  onValueChange={setGroups}
                  items={customerFormData?.customers_groups || []}
                  placeholder="Select a group"
                  loading={customerFormDataLoading}
                  style={styles.pickerContainer}
                  getLabel={item => item.name}
                  getValue={item => item.id}
                />
              </View>
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabel}>
                  <Icon
                    name="cash"
                    size={f(2.5)}
                    color="#F7374F"
                    style={styles.fieldIcon}
                  />
                  <Text style={styles.labelText}>Currency</Text>
                </View>
                <CustomDropdown
                  value={currency}
                  onValueChange={setCurrency}
                  items={customerFormData?.currencies || []}
                  placeholder="Select a currency"
                  loading={customerFormDataLoading}
                  style={styles.pickerContainer}
                  getLabel={item => `${item.name} (${item.symbol})`}
                  getValue={item => item.id}
                />
              </View>
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabel}>
                  <Icon
                    name="language"
                    size={f(2.5)}
                    color="#F7374F"
                    style={styles.fieldIcon}
                  />
                  <Text style={styles.labelText}>Language</Text>
                </View>
                <CustomDropdown
                  value={language}
                  onValueChange={setLanguage}
                  items={customerFormData?.languages || []}
                  placeholder="Select a language"
                  loading={customerFormDataLoading}
                  style={styles.pickerContainer}
                  getLabel={item => item.charAt(0).toUpperCase() + item.slice(1)}
                  getValue={item => item}
                />
              </View>
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
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldLabel}>
                      <Icon
                        name="flag"
                        size={f(2.5)}
                        color="#F7374F"
                        style={styles.fieldIcon}
                      />
                      <Text style={styles.labelText}>Country</Text>
                    </View>
                    <CustomDropdown
                      value={billingAddress.country}
                      onValueChange={value =>
                        setBillingAddress({
                          ...billingAddress,
                          country: value,
                        })
                      }
                      items={customerFormData?.countries || []}
                      placeholder="Select a country"
                      loading={customerFormDataLoading}
                      style={styles.pickerContainer}
                      getLabel={item => item.long_name}
                      getValue={item => item.country_id}
                    />
                  </View>
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
                  <View style={styles.fieldContainer}>
                    <View style={styles.fieldLabel}>
                      <Icon
                        name="flag"
                        size={f(2.5)}
                        color="#F7374F"
                        style={styles.fieldIcon}
                      />
                      <Text style={styles.labelText}>Country</Text>
                    </View>
                    <CustomDropdown
                      value={shippingAddress.country}
                      onValueChange={value =>
                        setShippingAddress({
                          ...shippingAddress,
                          country: value,
                        })
                      }
                      items={customerFormData?.countries || []}
                      placeholder="Select a country"
                      loading={customerFormDataLoading}
                      style={styles.pickerContainer}
                      getLabel={item => item.long_name}
                      getValue={item => item.country_id}
                    />
                  </View>
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
              disabled={addCustomerLoading}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.submitGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                {addCustomerLoading ? (
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
    marginBottom: h(14.4),
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
  pickerContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: w(2),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: h(6),
    width: '100%',
    color: '#333',
  },
  loadingContainer: {
    height: h(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  customDropdownContainer: {
    width: '100%',
  },
  customDropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: w(2),
    padding: w(3),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  customDropdownButtonText: {
    fontSize: f(2),
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContent: {
    backgroundColor: 'white',
    borderRadius: w(3),
    width: '85%',
    maxHeight: h(60),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: w(4),
    borderTopLeftRadius: w(3),
    borderTopRightRadius: w(3),
  },
  dropdownTitle: {
    fontSize: f(2.4),
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    padding: w(1),
  },
  searchContainer: {
    padding: w(3),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: w(2),
    paddingHorizontal: w(3),
    paddingVertical: w(2),
  },
  searchIcon: {
    marginRight: w(2),
  },
  searchInput: {
    flex: 1,
    fontSize: f(2),
    color: '#333',
    padding: w(2),
    fontFamily: 'Poppins-Regular',
  },
  clearSearchButton: {
    padding: w(1),
  },
  dropdownList: {
    maxHeight: h(45),
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: w(3),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemSelected: {
    backgroundColor: '#FFF5F6',
  },
  dropdownItemText: {
    fontSize: f(2),
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  dropdownItemTextSelected: {
    color: '#F7374F',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  noResultsContainer: {
    padding: w(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: f(2),
    color: '#666',
    marginTop: h(2),
    fontFamily: 'Poppins-Regular',
  },
});

export default AddCustomers;
