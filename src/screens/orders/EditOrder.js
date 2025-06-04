import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { h, w, f } from 'walstar-rn-responsive';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  editUpcomingOrder,
  fetchProductGrades,
  fetchCustomers
} from '../../../Redux/slices/orderSlice';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons';

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
      if (selectedItem) {
        setSelectedLabel(getLabel(selectedItem));
      } else {
        setSelectedLabel(placeholder);
      }
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

const EditOrder = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { order } = route.params;
  console.log(' EditData:', order);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  const { productGrades, productGradesLoading, customers, customersLoading } = useSelector(
    state => state.order,
  );

  // Initialize form data with the order details
  const [formData, setFormData] = useState({
    customer_id: order.customer_id || order.company || '',
    customer_details: order.customer_details || order.company_name || '',
    product_grade_id: order.product_grade_id || order.productGrade || '',
    quantity: order.quantity?.replace('.00 kg', '') || '',
    order_date: order.order_date || order.date || '',
    on_site_time:
      order.on_site_time?.replace(':00', '') ||
      order.onsiteTime?.replace(':00', '') ||
      '',
    address: order.address || '',
    order_type:
      order.order_type || (order.type === 'Pumping' ? '1' : '2') || '',
    description: order.description || '',
    confirm: order.confirm === "confirmed" ? "1" : "0",
  });

  // Add this useEffect to set initial values when data is loaded
  useEffect(() => {
    if (customers && customers.length > 0 && formData.customer_id) {
      const selectedCustomer = customers.find(c => c.id === formData.customer_id);
      if (selectedCustomer) {
        setFormData(prev => ({
          ...prev,
          customer_id: selectedCustomer.id,
          customer_details: selectedCustomer.name,
        }));
      }
    }
  }, [customers, formData.customer_id]);

  useEffect(() => {
    if (productGrades && productGrades.length > 0 && formData.product_grade_id) {
      const selectedGrade = productGrades.find(g => g.id === formData.product_grade_id);
      if (selectedGrade) {
        setFormData(prev => ({
          ...prev,
          product_grade_name: selectedGrade.name
        }));
      }
    }
  }, [productGrades, formData.product_grade_id]);

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

  const handleCustomerSelect = customerId => {
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customer_id: selectedCustomer.id,
        customer_details: selectedCustomer.name,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      // Check if any required field is empty or undefined
      if (
        !formData.customer_id ||
        !formData.product_grade_id ||
        !formData.quantity ||
        !formData.order_date ||
        !formData.on_site_time ||
        !formData.address ||
        !formData.order_type
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        setIsUpdating(false);
        return;
      }

      // Find the selected customer from the customers list
      const selectedCustomer = customers?.find(c => c.id === formData.customer_id);
      
      const formattedData = {
        ...formData,
        customer_details: formData.customer_id?.toString(),
        quantity: formData.quantity?.toString().replace(/[^0-9.]/g, ''),
        order_date: formData.order_date?.trim(),
        on_site_time: formData.on_site_time?.trim(),
        address: formData.address?.trim(),
        order_type: formData.order_type?.toString(),
        product_grade_id: formData.product_grade_id?.toString(),
        confirm: formData.confirm?.toString(),
      };
      console.log("formattedData", formattedData)

      const resultAction = await dispatch(
        editUpcomingOrder({ id: order.id, orderData: formattedData }),
      );

      if (editUpcomingOrder.fulfilled.match(resultAction)) {
        setIsUpdating(false);
        Alert.alert(
          'Success',
          'Order updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('UpcomingOrders'),
            },
          ],
          { cancelable: false },
        );
      } else {
        setIsUpdating(false);
        const errorMessage = resultAction.payload;
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      setIsUpdating(false);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateConfirm = date => {
    setDatePickerOpen(false);
    setSelectedDate(date);
    const formattedDate = date.toISOString().split('T')[0];
    handleChange('order_date', formattedDate);
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

  useEffect(() => {
    console.log('Updated formData:', formData,);
  }, [formData]);
  return (
    <>
      <LinearGradient
        colors={['#F7374F', '#FF6B6B']}
        style={styles.statusBarArea}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <SafeAreaView edges={['top']} style={styles.statusBarAreaInner} />
      </LinearGradient>
      <View style={styles.container}>
        <Header
          title="Edit Order"
          navigation={navigation}
          showBackButton="arrow-back"
        />
        {isUpdating && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#F7374F" />
          </View>
        )}
        <ScrollView 
          contentContainerStyle={styles.content}
          scrollEnabled={!isUpdating}>
          <View style={[styles.card, isUpdating && styles.disabledCard]}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Name</Text>
              <CustomDropdown
                value={formData.customer_id}
                onValueChange={value => {
                  const selectedCustomer = customers.find(c => c.id === value);
                  if (selectedCustomer) {
                    setFormData(prev => ({
                      ...prev,
                      customer_id: selectedCustomer.id,
                      customer_details: selectedCustomer.name,
                    }));
                  }
                }}
                items={customers || []}
                placeholder={formData.customer_details || "Select a company"}
                loading={customersLoading}
                style={styles.pickerContainer}
                getLabel={item => item.name}
                getValue={item => item.id}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Grade</Text>
              <CustomDropdown
                value={formData.product_grade_id}
                onValueChange={value => {
                  const selectedGrade = productGrades.find(g => g.id === value);
                  setFormData(prev => ({
                    ...prev,
                    product_grade_id: value,
                    product_grade_name: selectedGrade ? selectedGrade.name : '',
                  }));
                }}
                items={productGrades || []}
                placeholder={formData.product_grade_id || "Select a product grade"}
                loading={productGradesLoading}
                style={styles.pickerContainer}
                getLabel={item => item.name}
                getValue={item => item.id}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={formData.quantity}
                onChangeText={text => handleChange('quantity', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: w(2) }]}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  onPress={() => setDatePickerOpen(true)}
                  style={styles.dateInput}>
                  <Text
                    style={[
                      styles.dateInputText,
                      !formData.order_date && { color: '#999' },
                    ]}>
                    {formData.order_date || 'Select a date'}
                  </Text>
                  <Icon name="calendar" size={f(2.5)} color="#F7374F" />
                </TouchableOpacity>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Time</Text>
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
                  <Icon name="time" size={f(2.5)} color="#F7374F" />
                </TouchableOpacity>
              </View>
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
            <DatePicker
              modal
              open={timePickerOpen}
              date={selectedTime}
              onConfirm={handleTimeConfirm}
              onCancel={() => setTimePickerOpen(false)}
              mode="time"
            />
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, { height: h(8) }]}
                value={formData.address}
                onChangeText={text => handleChange('address', text)}
                multiline
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Order Type</Text>
              <View style={styles.statusOptions}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.order_type === '1' && styles.statusButtonActive,
                  ]}
                  onPress={() => handleChange('order_type', '1')}>
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.order_type === '1' &&
                      styles.statusButtonTextActive,
                    ]}>
                    Pumping
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.order_type === '2' && styles.statusButtonActive,
                  ]}
                  onPress={() => handleChange('order_type', '2')}>
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.order_type === '2' &&
                      styles.statusButtonTextActive,
                    ]}>
                    Dumping
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: h(8) }]}
                value={formData.description || ''}
                onChangeText={text => handleChange('description', text)}
                multiline
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusOptions}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.confirm === '1' && styles.statusButtonActive,
                  ]}
                  onPress={() => handleChange('confirm', '1')}>
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.confirm === '1' && styles.statusButtonTextActive,
                    ]}>
                    Confirmed
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.confirm === '0' && styles.statusButtonActive,
                  ]}
                  onPress={() => handleChange('confirm', '0')}>
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.confirm === '0' && styles.statusButtonTextActive,
                    ]}>
                    Pending
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <LinearGradient
              colors={['#F7374F', '#FF6B6B']}
              style={styles.updateButton}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <TouchableOpacity 
                onPress={handleUpdate}
                disabled={isUpdating}
                style={styles.updateButtonInner}>
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.updateButtonText}>Update Order</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  statusBarArea: {
    height: h(2),
  },
  statusBarAreaInner: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    padding: w(1),
  },
  content: {
    padding: w(4),
    paddingBottom: h(4),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: w(3),
    padding: w(4),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: h(2),
  },
  label: {
    fontSize: f(2),
    color: '#555',
    marginBottom: h(0.5),
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: w(2),
    padding: w(3),
    fontSize: f(2),
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOptions: {
    flexDirection: 'row',
    marginTop: h(1),
  },
  statusButton: {
    paddingVertical: h(1),
    paddingHorizontal: w(4),
    borderRadius: w(2),
    marginRight: w(2),
    backgroundColor: '#F5F7FA',
  },
  statusButtonActive: {
    backgroundColor: '#4CAF50',
  },
  statusButtonText: {
    fontSize: f(2),
    color: '#555',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  updateButton: {
    backgroundColor: '#F7374F',
    paddingVertical: h(1.5),
    borderRadius: w(2),
    marginTop: h(2),
  },
  updateButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: h(5),
  },
  updateButtonText: {
    fontSize: f(2.2),
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
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
  dateInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: w(2),
    padding: w(3),
    fontSize: f(2),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: {
    fontSize: f(2),
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
    shadowOffset: { width: 0, height: 4 },
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  disabledCard: {
    opacity: 0.7,
  },
});
export default EditOrder;
