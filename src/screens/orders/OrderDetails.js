import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {h, w, f} from 'walstar-rn-responsive';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';

const OrderDetails = ({route, navigation}) => {
  const {order} = route.params;
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
          title="Order Details"
          navigation={navigation}
          showBackButton="arrow-back"
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    order.confirm === '1' ? '#4CAF50' : '#FFC107',
                  shadowColor:
                    order.confirm === '1' ? '#4CAF50' : '#FFC107',
                },
              ]}>
              <Text style={styles.statusText}>
                {order.confirm === '1' ? 'Confirmed' : 'Pending'}
              </Text>
            </View>
            <View style={styles.cardHeader}>
              <View style={styles.customerInfo}>
                <Icon
                  name="person-circle-outline"
                  size={f(4)}
                  color="#F7374F"
                />
                <Text style={styles.customerName}>
                  {order.customer_details}
                </Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={['#F7374F', '#FF8A65']}
                  style={styles.sectionIcon}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  <Icon name="cube-outline" size={f(2.5)} color="white" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Order Information</Text>
              </View>

              <DetailRow
                icon="cube-outline"
                label="Product Name:"
                value={order.productGrade}
              />
              <DetailRow
                icon="scale-outline"
                label="Quantity:"
                value={order.quantity}
              />
              <DetailRow
                icon="pricetag-outline"
                label="Type:"
                value={order?.type}
              />
            </View>

            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={['#F7374F', '#FF8A65']}
                  style={styles.sectionIcon}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  <Icon name="car-outline" size={f(2.5)} color="white" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Delivery Details</Text>
              </View>

              <DetailRow
                icon="calendar-outline"
                label="Date:"
                value={`${order.date} at ${order.onsiteTime}`}
              />
              <DetailRow
                icon="location-outline"
                label="Address:"
                value={order.address}
              />
            </View>

            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={['#F7374F', '#FF8A65']}
                  style={styles.sectionIcon}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  <Icon
                    name="document-text-outline"
                    size={f(2.5)}
                    color="white"
                  />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Additional Information</Text>
              </View>

              <DetailRow
                icon="document-text-outline"
                label="Description:"
                value={order.description}
                lastItem
              />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => navigation.navigate('EditOrder', {order})}>
                <Icon name="create-outline" size={f(2.5)} color="#4A90E2" />
                <Text style={styles.actionButtonText}>Edit Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const DetailRow = ({icon, label, value, lastItem}) => (
  <View style={[styles.detailRow, !lastItem && styles.rowBorder]}>
    <View style={styles.detailIcon}>
      <Icon name={icon} size={f(3)} color="#F7374F" />
    </View>
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
    backgroundColor: '#f5f5f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  content: {
    padding: w(4),
    paddingBottom: h(4),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: w(4),
    padding: w(4),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: h(2),
    paddingBottom: h(2),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginTop:h(3.8)
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerName: {
    fontSize: f(2.6),
    color: '#333',
    marginLeft: w(2),
    fontWeight: '500',
  },
  statusBadge: {
    // paddingHorizontal: w(3.5),
    // paddingVertical: h(0.8),
    // borderRadius: w(5),
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 3,
    position: 'absolute',
    top: w(2.8),
    right: w(2), 
    paddingHorizontal: w(5.8),
    paddingVertical: h(0.88),
    borderRadius: w(5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'flex-start',
    // marginBottom:10
  },
  statusText: {
    fontSize: f(1.8),
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  detailSection: {
    marginBottom: h(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(2),
  },
  sectionIcon: {
    width: w(8),
    height: w(8),
    borderRadius: w(4),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: w(3),
  },
  sectionTitle: {
    fontSize: f(2.4),
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: h(1.5),
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  detailIcon: {
    width: w(8),
    height: w(8),
    borderRadius: w(4),
    backgroundColor: 'rgba(247, 55, 79, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: w(3),
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: f(1.8),
    color: '#666',
    marginBottom: h(0.3),
  },
  detailValue: {
    fontSize: f(2),
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: h(1),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: h(1.5),
    paddingHorizontal: w(4),
    borderRadius: w(2),
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  printButton: {
    backgroundColor: 'rgba(247, 55, 79, 0.1)',
    borderColor: 'rgba(247, 55, 79, 0.3)',
  },
  actionButtonText: {
    fontSize: f(2),
    fontFamily: 'Poppins-Medium',
    marginLeft: w(2),
  },
});
export default OrderDetails;
