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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {h, w, f} from 'walstar-rn-responsive';

const EditInwardScreen = ({route, navigation}) => {
  const {material} = route.params;
  const [form, setForm] = useState({...material});

  const handleChange = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const handleSave = () => {
    console.log('Updated Material:', form);
    navigation.goBack();
  };

  const fields = [
    {
      label: 'Material Name',
      key: 'material_name',
      icon: 'drive-file-rename-outline',
    },
    {label: 'Date', key: 'date', icon: 'calendar-month'},
    {label: 'Quantity', key: 'quantity', icon: 'scale'},
    {label: 'Challan No', key: 'challan_no', icon: 'pin'},
    {label: 'Vehicle No', key: 'vehicle_no', icon: 'local-shipping'},
    {label: 'Load Weight', key: 'load_wt', icon: 'scale'},
    {label: 'Unload Weight', key: 'unload_wt', icon: 'scale'},
    {label: 'Per Kg Cost (₹)', key: 'perkg_cost', icon: 'currency-rupee', type: 'numeric'},
    {label: 'Total Bill (₹)', key: 'total_bill', icon: 'receipt-long', type: 'numeric'},
    {label: 'Paid Amount (₹)', key: 'paid_amount', icon: 'credit-score', type: 'numeric'},
    {label: 'Remaining Amount (₹)', key: 'remaining_amount', icon: 'currency-rupee', type: 'numeric'},
    {label: 'Payment Method', key: 'payment_method', icon: 'payment'},
    {label: 'Description', key: 'description', icon: 'description', multiline: true},
  ];

  return (
    <>
      <SafeAreaView edges={['top']} style={styles.statusBarArea} />
      <StatusBar barStyle="light-content" backgroundColor="#F7374F" />

      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Icon name="arrow-back" size={f(3.5)} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Material</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {fields.map(({label, key, icon, type, multiline}) => (
              <View key={key} style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Icon2
                    name={icon}
                    size={f(2.2)}
                    color="#F7374F"
                    style={styles.labelIcon}
                  />
                  <Text style={styles.label}>{label}</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    multiline && styles.multilineInput,
                    key.includes('amount') || key.includes('cost') || key.includes('bill') ? styles.amountInput : null
                  ]}
                  value={form[key]}
                  onChangeText={value => handleChange(key, value)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  placeholderTextColor="#999"
                  keyboardType={type || 'default'}
                  multiline={multiline}
                  numberOfLines={multiline ? 4 : 1}
                />
              </View>
            ))}

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>Save Changes</Text>
                <Icon name="checkmark-circle" size={f(2.2)} color="white" style={styles.btnIcon} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
                <Icon name="close-circle" size={f(2.2)} color="#F7374F" style={styles.btnIcon} />
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
    // elevation: 5,
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
  amountInput: {
    fontWeight: '600',
    color: '#F7374F',
  },
  multilineInput: {
    height: h(10),
    textAlignVertical: 'top',
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

export default EditInwardScreen;