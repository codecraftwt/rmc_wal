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
} from 'react-native';
import {h, w, f} from 'walstar-rn-responsive';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';

const EditOrder = ({route, navigation}) => {
  const {order} = route.params;
  const [formData, setFormData] = useState({
    customer_details: order.customer_details,
    productGrade: order.productGrade,
    quantity: order.quantity,
    date: order.date,
    onsiteTime: order.onsiteTime,
    address: order.address,
    type: order.type,
    description: order.description,
    status: order.status,
  });

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

  const handleUpdate = () => {
    Alert.alert('Success', 'Order updated successfully!');
    navigation.goBack();
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
              <Text style={styles.label}>Customer Name</Text>
              <TextInput
                style={styles.input}
                value={formData.customer_details}
                onChangeText={text => handleChange('customer_details', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Grade</Text>
              <TextInput
                style={styles.input}
                value={formData.productGrade}
                onChangeText={text => handleChange('productGrade', text)}
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
              <View style={[styles.inputGroup, {flex: 1, marginRight: w(2)}]}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={formData.date}
                  onChangeText={text => handleChange('date', text)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View style={[styles.inputGroup, {flex: 1}]}>
                <Text style={styles.label}>Time</Text>
                <TextInput
                  style={styles.input}
                  value={formData.onsiteTime}
                  onChangeText={text => handleChange('onsiteTime', text)}
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
              <Text style={styles.label}>Delivery Type</Text>
              <TextInput
                style={styles.input}
                value={formData.type}
                onChangeText={text => handleChange('type', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, {height: h(8)}]}
                value={formData.description}
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
                    formData.status === 'confirmed' &&
                      styles.statusButtonActive,
                  ]}
                  onPress={() => handleChange('status', 'confirmed')}>
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.status === 'confirmed' &&
                        styles.statusButtonTextActive,
                    ]}>
                    Confirmed
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.status === 'pending' && styles.statusButtonActive,
                  ]}
                  onPress={() => handleChange('status', 'pending')}>
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.status === 'pending' &&
                        styles.statusButtonTextActive,
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
                // style={styles.updateButton}
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
});

export default EditOrder;
