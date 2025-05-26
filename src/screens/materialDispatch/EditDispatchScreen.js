import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {h, w, f} from 'walstar-rn-responsive';

const EditDispatchScreen = ({route, navigation}) => {
  const {dispatchData} = route.params;

  const [form, setForm] = useState({...dispatchData});

  const handleChange = (key, value) => {
    setForm({...form, [key]: value});
  };

  const handleSave = () => {
    console.log('Updated Data:', form);
    navigation.goBack();
  };

  const fields = [

    {label: 'Customer Name', key: 'customer_name', icon: 'person-outline'},
    {label: 'Product Grade', key: 'product_grade', icon: 'star-half'},
    {label: 'Vehicle Number', key: 'vehicle_no', icon: 'car-outline'},
    {label: 'Date', key: 'date', icon: 'calendar-outline'},
    {label: 'Driver Name', key: 'driver_name', icon: 'id-card-outline'},
    {label: 'Out Time', key: 'out_time', icon: 'time-outline'},
    {label: 'Amount (₹)', key: 'amount', icon: 'cash-outline', type: 'numeric'},
    {
      label: 'Total Cost (₹)',
      key: 'total_cost',
      icon: 'wallet-outline',
      type: 'numeric',
    },
  ];

  return (
    <>
      <SafeAreaView edges={['top']} style={styles.statusBarArea} />
      <StatusBar barStyle="light-content" backgroundColor="#F7374F" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={f(3.5)} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Dispatch</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            {fields.map((field, index) => (
              <View key={index} style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Icon
                    name={field.icon}
                    size={f(2.2)}
                    color="#F7374F"
                    style={styles.labelIcon}
                  />
                  <Text style={styles.label}>{field.label}</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={form[field.key]}
                  onChangeText={value => handleChange(field.key, value)}
                  keyboardType={field.type || 'default'}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  placeholderTextColor="#999"
                />
              </View>
            ))}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                activeOpacity={0.8}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
                <Icon
                  name="checkmark-circle"
                  size={f(2.2)}
                  color="white"
                  style={styles.btnIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
                <Icon
                  name="close-circle"
                  size={f(2.2)}
                  color="#F7374F"
                  style={styles.btnIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  statusBarArea: {
    backgroundColor: '#F7374F',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#F7374F',
    paddingVertical: h(2),
    paddingHorizontal: w(4),
    borderBottomLeftRadius: w(5),
    borderBottomRightRadius: w(5),
    height: h(10),
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: f(2.8),
    color: 'white',
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: w(10),
  },
  backButton: {
    width: w(10),
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContent: {
    paddingVertical: h(2),
    paddingHorizontal: w(4),
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: w(5),
    marginBottom: h(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: h(3),
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(1),
  },
  labelIcon: {
    marginRight: w(2),
  },
  label: {
    fontSize: f(2),
    fontWeight: '500',
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: h(1.5),
    paddingHorizontal: w(4),
    backgroundColor: '#fafafa',
    fontSize: f(2),
    color: '#333',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  buttonContainer: {
    marginTop: h(2),
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7374F',
    paddingVertical: h(1.8),
    borderRadius: 8,
    marginBottom: h(2),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveBtnText: {
    color: 'white',
    fontSize: f(2.1),
    fontWeight: '600',
    marginRight: w(2),
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: h(1.8),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F7374F',
  },
  cancelBtnText: {
    color: '#F7374F',
    fontSize: f(2.1),
    fontWeight: '600',
    marginRight: w(2),
  },
  btnIcon: {
    marginLeft: w(1),
  },
});

export default EditDispatchScreen;
