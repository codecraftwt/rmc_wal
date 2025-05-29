import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { h, w, f } from 'walstar-rn-responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  addUpcomingOrder,
  resetAddOrderState,
  fetchProductGrades,
} from '../../../Redux/slices/addOrderSlice';
import {Picker} from '@react-native-picker/picker';

const AddOrder = ({navigation}) => {
  const dispatch = useDispatch();

  const {loading, success, error} = useSelector(state => state.addOrder);
  const {productGrades, productGradesLoading} = useSelector(
    state => state.order,
  );

  const [formData, setFormData] = useState({
    customer_name: '',
    product_grade: '',
    quantity: '',
    date: '',
    on_site_time: '',
    address: '',
    order_type: '',
    description: '',
    confirm: '0',
  });

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

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
    dispatch(addUpcomingOrder(formData));
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

      <LinearGradient
        colors={['#F8FAFF', '#F0F4FF']}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <Header
          title="Add New Order"
          navigation={navigation}
          showBackButton="arrow-back"
        />

        <ScrollView contentContainerStyle={styles.formContainer}>
          <FormField
            icon="person-outline"
            label="Customer Name"
            value={formData.customer_name}
            onChangeText={text => handleChange('customer_name', text)}
            required
          />
          <FormField
            icon="cube-outline"
            label="Product Grade"
            value={formData.product_grade}
            onChangeText={text => handleChange('product_grade', text)}
            required
            isDropdown={true}
            dropdownItems={productGrades || []}
            loading={productGradesLoading}
          />
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
                  !formData.date && {color: '#999'},
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
                  !formData.on_site_time && {color: '#999'},
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
          {/* <FormField
            icon="pricetag-outline"
            label="Type"
            value={formData.order_type}
            onChangeText={text => handleChange('order_type', text)}
            placeholder="Pumping/Dumping etc."
          /> */}

<View style={{ marginBottom: 20 }}>
  <Text style={{ fontSize: 16, marginBottom: 8 }}>Type</Text>
  <View
    style={{
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: '#ffffff',
    }}
  >
    <Picker
      selectedValue={formData.order_type}
      onValueChange={(itemValue) =>
        setFormData((prev) => ({ ...prev, order_type: itemValue }))
      }
      mode="dropdown"
      style={{ height: 55 }}
    >
      <Picker.Item label="Select Type" value="" />
      <Picker.Item label="Pumping" value="Pumping" />
      <Picker.Item label="Dumping" value="Dumping" />
    </Picker>
  </View>
</View>


          <FormField
            icon="document-text-outline"
            label="Description"
            value={formData.description}
            onChangeText={text => handleChange('description', text)}
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
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
                  <Icon name="checkmark" size={f(2.5)} color="white" style={styles.submitIcon} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
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
      <Icon name={icon} size={f(2.5)} color="#F7374F" style={styles.fieldIcon} />
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
              dropdownIconColor="#F7374F"
            >
              <Picker.Item label="Select an option" value="" />
              {Array.isArray(dropdownItems) && dropdownItems.map((item) => (
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
    pickerContainer: {
    backgroundColor: 'white',
    borderRadius: w(2),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  picker: {
    height: h(6),
    width: '100%',
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
  backButton: {
    position: 'absolute',
    left: w(4),
    padding: w(1),
  },
  formContainer: {
    padding: w(5),
    paddingBottom: h(10),
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
  input: {
    backgroundColor: 'white',
    borderRadius: w(2),
    padding: w(3),
    fontSize: f(2),
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButton: {
    marginTop: h(3),
    borderRadius: w(2),
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  submitGradient: {
    paddingVertical: h(1.8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: f(2.2),
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    letterSpacing: 0.5,
  },
  submitIcon: {
    marginLeft: w(2),
  },
  dateInput: {
    backgroundColor: 'white',
    borderRadius: w(2),
    padding: w(3),
    fontSize: f(2),
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: {
    fontSize: f(2),
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  inputContainer: {
    position: 'relative',
  },
  unitText: {
    position: 'absolute',
    right: w(3),
    top: h(1.5),
    fontSize: f(2),
    // color: '#888',
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
});

export default AddOrder;