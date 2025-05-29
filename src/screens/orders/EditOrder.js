import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {h, w, f} from 'walstar-rn-responsive';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import {useDispatch, useSelector} from 'react-redux';
import {editUpcomingOrder, fetchProductGrades} from '../../../Redux/slices/orderSlice';
import {Picker} from '@react-native-picker/picker';

const EditOrder = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {order} = route.params;

  const {productGrades, productGradesLoading} = useSelector(
    state => state.order,
  );

  // Initialize form data with the order details
  const [formData, setFormData] = useState({
    customer_id: order.company || '',
    customer_details: order.customer_details || '',
    product_grade_id: order.product_name || order.productGrade || '',
    quantity: order.quantity?.replace('.00 kg', '') || '',
    order_date: order.order_date || order.date || '',
    on_site_time: order.on_site_time?.replace(':00', '') || order.onsiteTime?.replace(':00', '') || '',
    address: order.address || '',
    order_type: order.order_type || (order.type === 'Pumping/Dumping' ? '1' : '2') || '',
    description: order.description || '',
    confirm: order.confirm === 1 ? '1' : '0'
  });

  useEffect(() => {
    dispatch(fetchProductGrades());
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

  const handleUpdate = async () => {
    try {
      if (!formData.customer_details || !formData.product_grade_id || !formData.quantity || 
          !formData.order_date || !formData.on_site_time || !formData.address || !formData.order_type) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      const formattedData = {
        ...formData,
        customer_details: formData.customer_details?.trim(),
        quantity: formData.quantity?.toString().replace(/[^0-9.]/g, ''),
        order_date: formData.order_date?.trim(),
        on_site_time: formData.on_site_time?.trim(),
        address: formData.address?.trim(),
        order_type: formData.order_type?.toString(),
        customer_id: formData.customer_id?.toString(),
        product_grade_id: formData.product_grade_id?.toString(),
        confirm: formData.confirm
      };
    
      const resultAction = await dispatch(
        editUpcomingOrder({id: order.id, orderData: formattedData})
      );
      
      if (editUpcomingOrder.fulfilled.match(resultAction)) {
        Alert.alert(
          'Success',
          'Order updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('UpcomingOrders'),
            },
          ],
          { cancelable: false }
        );
      } else {
        const errorMessage = resultAction.payload;
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };
  const handleChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };
  return (
    <>
      <LinearGradient
        colors={['#F7374F', '#FF6B6B']}
        style={styles.statusBarArea}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <SafeAreaView edges={['top']} style={styles.statusBarAreaInner} />
      </LinearGradient>
      <View style={styles.container}>
        <Header
          title="Edit Order"
          navigation={navigation}
          showBackButton="arrow-back"
        />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                style={styles.input}
                value={formData.customer_details}
                onChangeText={text => handleChange('customer_details', text)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Grade</Text>
              <View style={styles.pickerContainer}>
                {productGradesLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#F7374F" />
                  </View>
                ) : (
                  <Picker
                    selectedValue={formData.product_grade_id}
                    onValueChange={value => handleChange('product_grade_id', value)}
                    style={styles.picker}
                    dropdownIconColor="#F7374F"
                  >
                    <Picker.Item label="Select a product grade" value="" />
                    {Array.isArray(productGrades) && productGrades.map((item) => (
                      <Picker.Item
                        key={item?.id || item?.name}
                        label={item?.name || 'Unknown'}
                        value={item?.id || ''}
                      />
                    ))}
                  </Picker>
                )}
              </View>
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
              <View style={[styles.inputGroup, {flex: 1, marginRight: w(2)}]}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                 value={formData.order_date}
                  onChangeText={text => handleChange('order_date', text)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View style={[styles.inputGroup, {flex: 1}]}>
                <Text style={styles.label}>Time</Text>
                <TextInput
                  style={styles.input}
                 value={formData.on_site_time}
                  onChangeText={text => handleChange('on_site_time', text)}
                  placeholder="HH:MM AM/PM"
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, {height: h(8)}]}
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
                      formData.order_type === '1' && styles.statusButtonTextActive,
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
                      formData.order_type === '2' && styles.statusButtonTextActive,
                    ]}>
                    Dumping
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
              <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, {height: h(8)}]}
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
                onPress={handleUpdate}>
                <Text style={styles.updateButtonText}>Update Order</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: h(2),
  },
  updateButtonText: {
    fontSize: f(2.2),
    color: '#FFFFFF',
    fontWeight: '600',
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
});
export default EditOrder;