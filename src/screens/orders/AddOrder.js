import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  BackHandler,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { h, w, f } from 'walstar-rn-responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import DatePicker from 'react-native-date-picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  addUpcomingOrder,
  resetAddOrderState,
} from '../../../Redux/slices/addOrderSlice';
import {
  fetchProductGrades,
  fetchCustomers,
} from '../../../Redux/slices/orderSlice';
import { Picker } from '@react-native-picker/picker';

const CustomDropdown = ({
  value,
  onValueChange,
  items,
  placeholder,
  loading,
  style,
  getLabel = item => item.name,
  getValue = item => item.id,
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
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
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
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.noResultsContainer}>
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

const AddOrder = ({ navigation }) => {
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(state => state.addOrder);
  const { productGrades, productGradesLoading } = useSelector(
    state => state.order,
  );
  const { customers, customersLoading } = useSelector(state => state.order);

  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    product_grade: '',
    quantity: '',
    date: '',
    on_site_time: '',
    address: '',
    order_type: '',
    description: '',
    confirm: '',
    // confirm: '0',
  });

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    dispatch(fetchProductGrades());
    dispatch(fetchCustomers());
  }, [dispatch]);

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

  useEffect(() => {
    if (success) {
      Alert.alert('Success', 'Order added successfully', [
        {
          text: 'OK',
          onPress: () => {
            dispatch(resetAddOrderState());
            navigation.navigate('UpcomingOrders');
          },
        },
      ]);
    }

    if (error) {
      Alert.alert('Error', error.toString());
    }
  }, [success, error]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomerSelect = customerId => {
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customer_id: selectedCustomer.id,
        customer_name: selectedCustomer.name,
        address: selectedCustomer.address,
      }));
    }
  };

  const handleDateConfirm = date => {
    setDatePickerOpen(false);
    setSelectedDate(date);
    const formattedDate = date.toISOString().split('T')[0];
    handleChange('date', formattedDate);
  };

  const handleTimeConfirm = time => {
    setTimePickerOpen(false);
    setSelectedTime(time);
    const formattedTime = time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    handleChange('on_site_time', formattedTime);
  };

  const handleSubmit = () => {
    if (
      !formData.customer_name ||
      !formData.product_grade ||
      !formData.quantity ||
      !formData.date ||
      !formData.on_site_time ||
      !formData.address ||
      !formData.order_type
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const orderTypeValue = formData.order_type === 'Pumping' ? '1' : '2';

    const submissionData = {
      customer_name: formData.customer_id,
      product_grade: formData.product_grade,
      quantity: formData.quantity?.toString().replace(/[^0-9.]/g, ''),
      date: formData.date?.trim(),
      on_site_time: formData.on_site_time?.trim(),
      address: formData.address?.trim(),
      order_type: orderTypeValue,
      description: formData.description || '',
      confirm: formData.confirm || '',
      // confirm: formData.confirm || '0',
    };

    dispatch(addUpcomingOrder(submissionData));
  };

  const orderTypes = [
    { label: 'Pumping', value: '1' },
    { label: 'Dumping', value: '2' },
  ];
  return (
    <>
      <LinearGradient
        colors={['#F7374F', '#FF6B6B']}
        style={styles.statusBarArea}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <SafeAreaView edges={['top']} style={styles.statusBarAreaInner} />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <LinearGradient
          colors={['#F8FAFF', '#F0F4FF']}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <Header
            title="Add New Order"
            navigation={navigation}
            showBackButton="arrow-back"
          />

          <ScrollView
            contentContainerStyle={styles.formContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabel}>
                <Icon
                  name="person-outline"
                  size={f(2.5)}
                  color="#F7374F"
                  style={styles.fieldIcon}
                />
                <Text style={styles.labelText}>
                  Company Name<Text style={styles.required}> *</Text>
                </Text>
              </View>
              {/* <View style={styles.pickerContainer}>
                {customersLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#F7374F" />
                  </View>
                ) : (
                  <Picker
                    selectedValue={formData.customer_id}
                    onValueChange={handleCustomerSelect}
                    style={styles.picker}
                    dropdownIconColor="#F7374F">
                    <Picker.Item label="Select a customer" value="" />
                    {Array.isArray(customers) &&
                      customers.map(item => (
                        <Picker.Item
                          key={item.id}
                          label={item.name}
                          value={item.id}
                        />
                      ))}
                  </Picker>
                )}
              </View> */}
              <CustomDropdown
                value={formData.customer_id}
                onValueChange={handleCustomerSelect}
                items={customers || []}
                placeholder="Select a company"
                loading={customersLoading}
                style={styles.pickerContainer}
                getLabel={item => item.name}
                getValue={item => item.id}
              />
            </View>

            {/* <FormField
              icon="cube-outline"
              label="Product Grade"
              value={formData.product_grade}
              onChangeText={text => handleChange('product_grade', text)}
              required
              isDropdown={true}
              dropdownItems={productGrades || []}
              loading={productGradesLoading}
            /> */}

            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabel}>
                <Icon
                  name="cube-outline"
                  size={f(2.5)}
                  color="#F7374F"
                  style={styles.fieldIcon}
                />
                <Text style={styles.labelText}>
                  Product Grade<Text style={styles.required}> *</Text>
                </Text>
              </View>
              <CustomDropdown
                value={formData.product_grade}
                onValueChange={value => handleChange('product_grade', value)}
                items={productGrades || []}
                placeholder="Select a product grade"
                loading={productGradesLoading}
                style={styles.pickerContainer}
                getLabel={item => item.name}
                getValue={item => item.id}
              />
            </View>

            <FormField
              icon="scale-outline"
              label="Quantity"
              value={formData.quantity}
              onChangeText={text => handleChange('quantity', text)}
              keyboardType="numeric"
              required
              unit="Kg"
            />

            {/* Date Field */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabel}>
                <Icon
                  name="calendar-outline"
                  size={f(2.5)}
                  color="#F7374F"
                  style={styles.fieldIcon}
                />
                <Text style={styles.labelText}>
                  Date<Text style={styles.required}> *</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setDatePickerOpen(true)}
                style={styles.dateInput}>
                <Text
                  style={[
                    styles.dateInputText,
                    !formData.date && { color: '#999' },
                  ]}>
                  {formData.date || 'Select a date'}
                </Text>
                <Icon name="calendar" size={f(2.5)} color="#888" />
              </TouchableOpacity>
            </View>
            <DatePicker
              modal
              open={datePickerOpen}
              date={selectedDate}
              onConfirm={handleDateConfirm}
              onCancel={() => setDatePickerOpen(false)}
              mode="date"
              minimumDate={new Date()}
            />

            {/* Time Field */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabel}>
                <Icon
                  name="time-outline"
                  size={f(2.5)}
                  color="#F7374F"
                  style={styles.fieldIcon}
                />
                <Text style={styles.labelText}>
                  Onsite Time<Text style={styles.required}> *</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setTimePickerOpen(true)}
                style={styles.dateInput}>
                <Text
                  style={[
                    styles.dateInputText,
                    !formData.on_site_time && { color: '#999' },
                  ]}>
                  {formData.on_site_time || 'Select time'}
                </Text>
                <Icon name="time" size={f(2.5)} color="#888" />
              </TouchableOpacity>
            </View>
            <DatePicker
              modal
              open={timePickerOpen}
              date={selectedTime}
              onConfirm={handleTimeConfirm}
              onCancel={() => setTimePickerOpen(false)}
              mode="time"
            />

            <FormField
              icon="location-outline"
              label="Address"
              value={formData.address}
              onChangeText={text => handleChange('address', text)}
              multiline
              required
            />

            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabel}>
                <Icon
                  name="pricetag-outline"
                  size={f(2.5)}
                  color="#F7374F"
                  style={styles.fieldIcon}
                />
                <Text style={styles.labelText}>
                  Type<Text style={styles.required}> *</Text>
                </Text>
              </View>
              <CustomDropdown
                value={formData.order_type}
                onValueChange={value => handleChange('order_type', value)}
                items={[
                  { id: 'Pumping', name: 'Pumping' },
                  { id: 'Dumping', name: 'Dumping' }
                ]}
                placeholder="Select Type"
                style={styles.pickerContainer}
                getLabel={item => item.name}
                getValue={item => item.id}
              />
            </View>

            <FormField
              icon="document-text-outline"
              label="Description"
              value={formData.description}
              onChangeText={text => handleChange('description', text)}
              multiline
            />

            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabel}>
                <Icon
                  name="checkmark-circle-outline"
                  size={f(2.5)}
                  color="#F7374F"
                  style={styles.fieldIcon}
                />
                <Text style={styles.labelText}>
                  Status<Text style={styles.required}> *</Text>
                </Text>
              </View>
              <CustomDropdown
                value={formData.confirm}
                onValueChange={value => handleChange('confirm', value)}
                items={[
                  { id: '0', name: 'Pending' },
                  { id: '1', name: 'Confirm' }
                ]}
                placeholder="Select Status"
                style={styles.pickerContainer}
                getLabel={item => item.name}
                getValue={item => item.id}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Create Order</Text>
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

// FormField Component (keep same)
const FormField = ({
  icon,
  label,
  value,
  onChangeText,
  required = false,
  unit = null,
  isDropdown = false,
  dropdownItems = [],
  loading = false,
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
      {isDropdown ? (
        <View style={styles.pickerContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#F7374F" />
            </View>
          ) : (
            <Picker
              selectedValue={value}
              onValueChange={onChangeText}
              style={styles.picker}
              dropdownIconColor="#F7374F">
              <Picker.Item label="Select an option" value="" />
              {Array.isArray(dropdownItems) &&
                dropdownItems.map(item => (
                  <Picker.Item
                    key={item?.id || item?.name}
                    label={item?.name || 'Unknown'}
                    value={item?.id || ''}
                  />
                ))}
            </Picker>
          )}
        </View>
      ) : (
        <>
          {unit && <Text style={styles.unitText}>{unit}</Text>}
          <TextInput
            style={[styles.input, unit && { paddingLeft: w(8) }]}
            value={value}
            onChangeText={onChangeText}
            {...props}
          />
        </>
      )}
    </View>
  </View>
);
const styles = StyleSheet.create({
  statusBarArea: {
    height: h(2),
  },
  statusBarAreaInner: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  formContainer: {
    padding: w(5),
    paddingBottom: Platform.OS === 'ios' ? h(15) : h(10),
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
    padding: Platform.OS === 'ios' ? h(2) : w(2.8),
    fontSize: f(2),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: Platform.OS === 'ios' ? h(5) : undefined,
  },
  pickerContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: w(2),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? h(6) : h(5),
    width: '100%',
    color: '#333',
  },
  submitButton: {
    marginTop: h(3),
    borderRadius: w(2),
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: Platform.OS === 'ios' ? h(0) : h(2),
  },
  submitGradient: {
    paddingVertical: Platform.OS === 'ios' ? h(0) : h(1.5),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: f(2.4),
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    letterSpacing: 0.5,
    paddingVertical: Platform.OS === 'ios' ? h(2) : h(0),
  },
  submitIcon: {
    marginLeft: w(2),
  },
  dateInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: w(2),
    padding: Platform.OS === 'ios' ? h(2) : w(2.8),
    fontSize: f(2),
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: Platform.OS === 'ios' ? h(5) : undefined,
  },
  dateInputText: {
    fontSize: f(2),
    fontFamily: 'Poppins-Regular',
    color: '#333',
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
    padding: Platform.OS === 'ios' ? h(2) : w(2.8),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: Platform.OS === 'ios' ? h(5) : undefined,
  },
  customDropdownButtonText: {
    fontSize: f(2),
    color: '#333',
    fontFamily: 'Poppins-Regular',
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
    width: '90%',
    maxHeight: h(60),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Platform.OS === 'android' ? w(1) : w(4),
    borderTopLeftRadius: w(3),
    borderTopRightRadius: w(3),
  },
  dropdownTitle: {
    fontSize: f(2.4),
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    paddingVertical: Platform.OS === 'android' ? 0 : h(2),
    marginLeft: Platform.OS === 'android' ? 0 : h(1),
  },
  closeButton: {
    padding: w(1),
    marginRight: Platform.OS === 'android' ? 0 : h(1),
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
    paddingVertical: Platform.OS === 'ios' ? h(1.5) : w(2),
  },
  searchIcon: {
    marginRight: w(2),
  },
  searchInput: {
    flex: 1,
    fontSize: f(2),
    color: '#333',
    padding: Platform.OS === 'ios' ? h(1) : w(2),
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
    padding: Platform.OS === 'ios' ? h(2) : w(3),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    minHeight: Platform.OS === 'ios' ? h(5) : undefined,
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
  loadingContainer: {
    height: Platform.OS === 'ios' ? h(6) : h(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddOrder;