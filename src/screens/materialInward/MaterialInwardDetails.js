import React,{useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {h, w, f} from 'walstar-rn-responsive';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../component/Header';

const MaterialInwardDetails = ({route, navigation}) => {
  const {material} = route.params;
  console.log("material ---->", material);
  

    useEffect(() => {
      const backAction = () => {
        navigation.goBack(); 
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
  
      return () => backHandler.remove();
    }, [navigation]);

  const renderDetailRow = (iconName, label, value, isAmount = false) => (
    <View style={styles.detailRow}>
      <View style={styles.iconContainer}>
        <Icon2 name={iconName} size={f(2.4)} color="#F7374F" />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, isAmount && styles.amountValue]}>
        {value}
        {isAmount && !value.includes('₹') && '₹'}
      </Text>
    </View>
  );

  return (
    <>
      <LinearGradient
        colors={['#F7374F', '#FF6B6B']}
        style={styles.statusBarArea}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <SafeAreaView edges={['top']} style={styles.statusBarAreaInner} />
      </LinearGradient>

      <Header title="Material Inward Details" navigation={navigation} showBackButton='arrow-back'/>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>

          <View style={styles.cardHeader}>
            <Text style={styles.materialName}>
              Material: {material.material_name}
            </Text>
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>{material.date}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            {renderDetailRow('scale', 'Quantity', material.quantity)}
            {renderDetailRow('pin', 'Challan No', material.challan_number
)}
            {renderDetailRow(
              'local-shipping',
              'Vehicle No',
              material.vehicle_number,
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weight Details</Text>
            {renderDetailRow('scale', 'Load Weight', material.load_weight)}
            {renderDetailRow('scale', 'Unload Weight', material.unload_weight
)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Details</Text>
            {renderDetailRow(
              'currency-rupee',
              'Per kg Cost',
              material.per_kg_amount
,
              true,
            )}
            {renderDetailRow(
              'receipt-long',
              'Total Bill',
              material.total_bill_amount
,
              true,
            )}
            {renderDetailRow(
              'credit-score',
              'Paid Amount',
              material.paid_amount
,
              true,
            )}
            {/* {renderDetailRow(
              'currency-rupee',
              'Remaining Amount',
              material.remaining_amount,
              true,
            )} */}
            {renderDetailRow(
              'payment',
              'Payment Method',
              material.payment_method,
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>
                {material.description || 'No description provided'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditInwardScreen', {material})}
            activeOpacity={0.8}>
            <Icon name="create-outline" size={f(2.4)} color="white" />
            <Text style={styles.editBtnText}>Edit Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: h(3),
    paddingBottom: h(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  materialName: {
    fontSize: f(2.5),
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  dateBadge: {
    backgroundColor: '#FFE8E8',
    paddingHorizontal: w(3),
    paddingVertical: h(0.7),
    borderRadius: 10,
  },
  dateText: {
    fontSize: f(1.8),
    color: '#F7374F',
    fontWeight: '500',
  },
  section: {
    marginBottom: h(3),
  },
  sectionTitle: {
    fontSize: f(2.1),
    fontWeight: '600',
    color: '#444',
    marginBottom: h(1.5),
    paddingLeft: w(2),
    borderLeftWidth: 3,
    borderLeftColor: '#F7374F',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(1.5),
    paddingLeft: w(1),
  },
  iconContainer: {
    width: w(6),
    alignItems: 'center',
    marginRight: w(2),
  },
  label: {
    fontSize: f(2),
    color: '#666',
    fontWeight: '500',
    width: w(40),
  },
  value: {
    fontSize: f(2),
    color: '#333',
    flex: 1,
  },
  amountValue: {
    fontWeight: '600',
    color: '#F7374F',
  },
  descriptionBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: w(4),
    marginTop: h(1),
  },
  descriptionText: {
    fontSize: f(1.9),
    color: '#555',
    lineHeight: h(3),
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7374F',
    paddingVertical: h(1.8),
    borderRadius: 8,
    marginTop: h(2),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editBtnText: {
    color: 'white',
    fontSize: f(2.1),
    fontWeight: '600',
    marginLeft: w(2),
  },
});

export default MaterialInwardDetails;
