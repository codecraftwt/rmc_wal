import React,{useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {h, w, f} from 'walstar-rn-responsive';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../component/Header';

const DetailsScreen = ({route, navigation}) => {
  const {dispatchData} = route.params;


  const handleEdit = () => {
    navigation.navigate('EditDispatchScreen', {dispatchData});
  };
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
  

  return (
    <>
      <LinearGradient
        colors={['#F7374F', '#FF6B6B']}
        style={styles.statusBarArea}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <SafeAreaView edges={['top']} style={styles.statusBarAreaInner} />
      </LinearGradient>

      <Header title="Dispatch Details" navigation={navigation} showBackButton='arrow-back'/>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.dispatchTitle}>
              Grade: {dispatchData.product_grade}
            </Text>
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>{dispatchData.date}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <View style={styles.detailItem}>
              <Icon2
                name="person"
                size={f(2.4)}
                color="#F7374F"
                style={styles.icon}
              />
              <Text style={styles.detailLabel}>Customer Name:</Text>
              <Text style={styles.detailValue}>
                {dispatchData.customer_name}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.detailItem}>
              <Icon
                name="star-half"
                size={f(2.4)}
                color="#F7374F"
                style={styles.icon}
              />
              <Text style={styles.detailLabel}>Grade:</Text>
              <Text style={styles.detailValue}>
                {dispatchData.product_grade}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon2
                name="numbers"
                size={f(2.4)}
                color="#F7374F"
                style={styles.icon}
              />
              <Text style={styles.detailLabel}>Quantity:</Text>
              <Text style={styles.detailValue}>
                {dispatchData.quantity} units
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transport Information</Text>
            <View style={styles.detailItem}>
              <Icon2
                name="local-shipping"
                size={f(2.4)}
                color="#F7374F"
                style={styles.icon}
              />
              <Text style={styles.detailLabel}>Vehicle No:</Text>
              <Text style={styles.detailValue}>{dispatchData.vehicle_no}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon2
                name="badge"
                size={f(2.4)}
                color="#F7374F"
                style={styles.icon}
              />
              <Text style={styles.detailLabel}>Driver:</Text>
              <Text style={styles.detailValue}>{dispatchData.driver_name}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon2
                name="schedule"
                size={f(2.4)}
                color="#F7374F"
                style={styles.icon}
              />
              <Text style={styles.detailLabel}>Out Time:</Text>
              <Text style={styles.detailValue}>{dispatchData.out_time}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Information</Text>
            <View style={styles.detailItem}>
              <Icon2
                name="currency-rupee"
                size={f(2.4)}
                color="#F7374F"
                style={styles.icon}
              />
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text
                style={[
                  styles.detailValue,
                  {color: '#4CAF50', fontWeight: '500'},
                ]}>
                ₹{dispatchData.amount}
              </Text>
            </View>
            <View style={[styles.detailItem, styles.totalCostItem]}>
              <Icon2
                name="receipt-long"
                size={f(2.4)}
                color="#F7374F"
                style={styles.icon}
              />
              <Text style={styles.detailLabel}>Total Cost:</Text>
              <Text style={styles.totalCostValue}>
                ₹{dispatchData.total_cost}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
            <Icon name="create-outline" size={f(2.4)} color="white" />
            <Text style={styles.editBtnText}>Edit Dispatch</Text>
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
  dispatchTitle: {
    fontSize: f(2.3),
    fontWeight: '700',
    color: '#333',
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
    paddingLeft: w(1),
    borderLeftWidth: 3,
    borderLeftColor: '#F7374F',
    paddingLeft: w(2),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(1.5),
    paddingLeft: w(1),
  },
  totalCostItem: {
    marginTop: h(2),
    paddingTop: h(1.5),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  icon: {
    marginRight: w(2),
    width: w(6),
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: f(2),
    color: '#666',
    fontWeight: '500',
    width: w(30),
  },
  detailValue: {
    fontSize: f(2),
    color: '#333',
    flex: 1,
  },
  totalCostValue: {
    fontSize: f(2.3),
    color: '#F7374F',
    fontWeight: '700',
    flex: 1,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7374F',
    paddingVertical: h(1.5),
    paddingHorizontal: w(6),
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

export default DetailsScreen;
