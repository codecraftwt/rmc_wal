import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {h, w, f} from 'walstar-rn-responsive';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUpcomingOrders,deleteUpcomingOrder} from '../../../Redux/slices/orderSlice';
import {useFocusEffect} from '@react-navigation/native';

const OrderCard = ({order, navigation, onDelete}) => {
  return (
    <View
      style={[
        styles.card,
        {
          borderLeftWidth: 4,
          borderLeftColor: order.status === 'confirmed' ? '#4CAF50' : '#FFC107',
        },
      ]}>
      <View style={styles.cardHeader}>
        <View style={styles.customerInfo}>
          <LinearGradient
            colors={['#4A90E2', '#5D9DF5']}
            style={styles.avatar}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <Icon name="person" size={f(2.5)} color="#FFF" />
          </LinearGradient>
          <Text style={styles.customerName}>{order.customer_details}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditOrder', {order})}
            style={styles.editButton}>
            <Icon name="create-outline" size={f(2.5)} color="#4A90E2" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(order.id)}
            style={styles.deleteButton}>
            <Icon name="trash-outline" size={f(2.5)} color="#F7374F" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('OrderDetails', {order})}
        activeOpacity={0.8}>
        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <Icon name="calendar-outline" size={f(2.2)} color="#4A90E2" />
          </View>
          <Text style={styles.detailText}>
            {/* {order.date} • {order.onsiteTime} */}
            {order.date} • {convertTo12Hour(order.onsiteTime)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <Icon name="location-outline" size={f(2.2)} color="#4A90E2" />
          </View>
          <Text style={styles.detailText} numberOfLines={1}>
            {order.address}
          </Text>
        </View>

        <View style={styles.footer}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  order.status === 'confirmed'
                    ? 'rgba(76, 175, 80, 0.1)'
                    : 'rgba(255, 193, 7, 0.1)',
                borderColor:
                  order.status === 'confirmed' ? '#4CAF50' : '#FFC107',
              },
            ]}>
            <Text
              style={[
                styles.statusText,
                {color: order.status === 'confirmed' ? '#4CAF50' : '#FFA000'},
              ]}>
              {order.status === 'confirmed' ? '✓ Confirmed' : '⌛ Pending'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const UpcomingOrders = ({navigation, route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const dispatch = useDispatch();
  const {upcomingOrders, loading, error} = useSelector(state => {
    console.log('Redux State in selector:', {
      loading: state.order.loading,
      error: state.order.error,
      hasOrders: !!state.order.upcomingOrders,
      ordersData: state.order.upcomingOrders,
    });
    return state.order;
  });

  const deleteLoading = useSelector(state => state.order.deleteLoading);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchUpcomingOrders());
    }, [dispatch]),
  );

  // useEffect(() => {
  //   console.log('State changed:', {
  //     loading,
  //     error,
  //     hasOrders: !!upcomingOrders,
  //     ordersData: upcomingOrders,
  //   });
  // }, [upcomingOrders, loading, error]);
  useEffect(() => {
    if (upcomingOrders && !loading && !error) {
      setShowAll(false);
    }
  }, [upcomingOrders, loading, error]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainTabs');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation]);

  const transformOrder = order => {
    console.log('Transforming order:', order); // Debug log
    return {
      id: order.id,
      customer_details: order.company || 'Unknown Customer',
      productGrade: order.product_name || 'Unknown Product',
      quantity: `${order.quantity} kg`,
      date: order.order_date || 'No date',
      onsiteTime: order.on_site_time || 'No time',
      address: order.address || 'No address',
      type: order.order_type === '1' ? 'Pumping' : 'Dumping',
      description: order.description || 'No description',
      status: order.confirm === '1' || order.confirm === 1 ? 'confirmed' : 'pending',
      confirm: order.confirm // Keep the original confirm value
    };
  };

  let transformedOrders = [];
  if (upcomingOrders && upcomingOrders.data) {
    transformedOrders = upcomingOrders.data.map(transformOrder);
    console.log('Transformed Orders:', transformedOrders); // Debug log
  }

  const filteredOrders = transformedOrders.filter(order => {
    const matchesSearch =
      order.customer_details
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.productGrade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const displayOrders = showAll
    ? filteredOrders
    : filteredOrders.slice(0,3);

  const shouldShowToggle = filteredOrders.length > 3;

  const handleDelete = id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this order?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const resultAction = await dispatch(deleteUpcomingOrder(id));
              if (deleteUpcomingOrder.fulfilled.match(resultAction)) {
                dispatch(fetchUpcomingOrders());
                Alert.alert('Success', 'Order deleted successfully');
              } else if (deleteUpcomingOrder.rejected.match(resultAction)) {
                Alert.alert('Error', 'Failed to delete order. Please try again.');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    // console.log('Rendering loading state');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    // console.log('Rendering error state:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading orders: {error}</Text>
      </View>
    );
  }

  // Debug log for final render
  console.log('Rendering main view with orders:', {
    hasOrders: !!upcomingOrders,
    ordersData: upcomingOrders,
    displayOrdersLength: displayOrders.length,
  });

  function convertTo12Hour(time24) {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
  }

  return (
    <>
      <LinearGradient
        colors={['#F7374F', '#FF6B6B']}
        style={styles.statusBarArea}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <SafeAreaView edges={['top']} style={styles.statusBarAreaInner} />
      </LinearGradient>

      <LinearGradient
        colors={['#F8FAFF', '#F0F4FF']}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <Header
          title="Upcoming Orders"
          showBackButton="arrow-back"
          navigation={navigation}
          rightIcon="add"
          onBackPress={() => navigation.navigate('MainTabs')} 
          onRightIconPress={() => navigation.navigate('AddOrder')}
        />

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={f(2.5)}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by company, material, or address"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={f(2.5)} color="#888" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Recent orders</Text>
          {shouldShowToggle && (
            <TouchableOpacity
              onPress={() => setShowAll(!showAll)}
              style={styles.seeAllButton}>
              <Text style={styles.toggleText}>
                {showAll ? 'Show Less' : 'See All'}
              </Text>
              <Icon
                name={showAll ? 'chevron-up' : 'chevron-down'}
                size={f(2.2)}
                color="#F7374F"
              />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={displayOrders}
          renderItem={({item}) => (
            <OrderCard
              order={item}
              navigation={navigation}
              onDelete={handleDelete}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="file-tray-outline" size={f(8)} color="#CCCCCC" />
              <Text style={styles.emptyText}>No orders found</Text>
              {searchQuery || filterStatus !== 'all' ? null : (
                <TouchableOpacity
                  style={styles.addEmptyButton}
                  onPress={() => navigation.navigate('AddOrder')}>
                  <Text style={styles.addEmptyButtonText}>Add New Order</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
        {deleteLoading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#F7374F" />
          </View>
        )}
      </LinearGradient>
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
  },
  addButton: {
    position: 'absolute',
    right: w(4),
    padding: w(1),
  },
  filterStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247, 55, 79, 0.1)',
    padding: w(3),
    marginHorizontal: w(4),
    borderRadius: w(2),
    marginTop: h(2),
  },
  filterStatusText: {
    color: '#F7374F',
    fontSize: f(2),
    marginRight: w(2),
  },
  listContent: {
    padding: w(4),
    paddingBottom: h(4),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: h(10),
  },
  emptyText: {
    fontSize: f(2.2),
    color: '#999',
    marginTop: h(2),
  },
  addEmptyButton: {
    marginTop: h(3),
    backgroundColor: '#F7374F',
    paddingHorizontal: w(6),
    paddingVertical: h(1.5),
    borderRadius: w(2),
  },
  addEmptyButtonText: {
    color: 'white',
    fontSize: f(2),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: w(3),
    padding: w(4),
    marginBottom: h(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: h(1.5),
    paddingBottom: h(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: w(8),
    height: w(8),
    borderRadius: w(4),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: w(3),
  },
  customerName: {
    fontSize: f(2.3),
    color: '#333',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: w(1.5),
    marginLeft: w(1),
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: w(2),
  },
  deleteButton: {
    padding: w(1.5),
    marginLeft: w(1),
    backgroundColor: 'rgba(247, 55, 79, 0.1)',
    borderRadius: w(2),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(1.5),
  },
  iconCircle: {
    width: w(7),
    height: w(7),
    borderRadius: w(3.5),
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: w(2),
  },
  detailText: {
    fontSize: f(2.1),
    color: '#555',
    flex: 1,
  },
  footer: {
    marginTop: h(1),
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: w(4),
    paddingVertical: h(0.8),
    borderRadius: w(2),
    borderWidth: 1,
  },
  statusText: {
    fontSize: f(1.9),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: w(4),
    paddingVertical: h(1),
    marginHorizontal: w(4),
    marginTop: h(2),
    marginBottom: h(1),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: w(2),
  },
  searchInput: {
    flex: 1,
    fontSize: f(2),
    color: '#333',
    paddingVertical: h(0.5),
    includeFontPadding: false,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: w(5),
    marginBottom: h(1),
  },
  sectionTitle: {
    fontSize: f(2.5),
    fontWeight: '600',
    color: '#333',
  },
  toggleText: {
    fontSize: f(2),
    color: '#F7374F',
    fontWeight: '500',
    marginRight: w(1),
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: w(4),
  },
  errorText: {
    color: '#F7374F',
    fontSize: f(2),
    textAlign: 'center',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
export default UpcomingOrders;
