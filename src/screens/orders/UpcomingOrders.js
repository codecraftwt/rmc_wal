import React, { useState, useEffect, useCallback } from 'react';
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
  Platform,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { h, w, f } from 'walstar-rn-responsive';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUpcomingOrders,
  deleteUpcomingOrder,
} from '../../../Redux/slices/orderSlice';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar as RNCalendar } from 'react-native-calendars';

const OrderCard = ({ order, navigation, onDelete }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  function convertTo12Hour(time24) {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
  }

  const handleEditPress = () => {
    setIsNavigating(true);
    navigation.navigate('EditOrder', { order });
  };

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
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Icon name="person" size={f(2.5)} color="#FFF" />
          </LinearGradient>
          <Text style={styles.customerName}>{order.customer_details}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={handleEditPress}
            style={styles.editButton}
            disabled={isNavigating}>
            {isNavigating ? (
              <ActivityIndicator size="small" color="#4A90E2" />
            ) : (
              <Icon name="create-outline" size={f(2.5)} color="#4A90E2" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(order.id)}
            style={styles.deleteButton}
            disabled={isNavigating}>
            <Icon name="trash-outline" size={f(2.5)} color="#F7374F" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('OrderDetails', { order })}
        activeOpacity={0.8}
        disabled={isNavigating}>
        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <Icon name="calendar-outline" size={f(2.2)} color="#4A90E2" />
          </View>
          <Text style={styles.detailText}>
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
                { color: order.status === 'confirmed' ? '#4CAF50' : '#FFA000' },
              ]}>
              {order.status === 'confirmed' ? '✓ Confirmed' : '⌛ Pending'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const UpcomingOrders = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [showAll, setShowAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const dispatch = useDispatch();
  const { upcomingOrders, loading, error, customers } = useSelector(state => {
    return state.order;
  });

  const deleteLoading = useSelector(state => state.order.deleteLoading);

  useEffect(() => {
    if (route.params?.showSuccess) {
      Alert.alert('Success', route.params.message);
      navigation.setParams({ showSuccess: undefined, message: undefined });
    }
  }, [route.params, navigation]);

  useEffect(() => {
    dispatch(fetchUpcomingOrders());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        try {
          await dispatch(fetchUpcomingOrders()).unwrap();
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };

      refreshData();
    }, [dispatch])
  );

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
        const customer = customers?.find(c => c.id === order.customer_id);
    
    const transformedOrder = {
      id: order.id,
      customer_details: customer?.name || order.customer_details || 'Unknown Customer',
      customer_id: order.customer_id || '',
      productGrade: order.product_name || 'Unknown Product',
      product_grade_id: order.product_grade_id || '',
      quantity: `${order.quantity} kg`,
      date: order.order_date || 'No date',
      onsiteTime: order.on_site_time || 'No time',
      address: order.address || 'No address',
      type: order.order_type === '1' ? 'Pumping' : 'Dumping',
      description: order.description || 'No description',
      status: order.confirm === '1' || order.confirm === 1 ? 'confirmed' : 'pending',
      confirm: order.confirm,
    };

    return transformedOrder;
  };

  let transformedOrders = [];
  if (upcomingOrders && upcomingOrders.data) {
    transformedOrders = upcomingOrders.data.map(transformOrder);
  }

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return formatDate(date1) === formatDate(date2);
  };

  const filteredOrders = transformedOrders.filter(order => {
    const matchesSearch =
      order.customer_details
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.productGrade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === 'all'
      ? true
      : activeTab === 'pending'
        ? order.status === 'pending'
        : order.status === 'confirmed';

    const matchesDate = selectedDate
      ? isSameDay(new Date(order.date), selectedDate)
      : true;

    return matchesSearch && matchesTab && matchesDate;
  });

  const displayOrders = showAll ? filteredOrders : filteredOrders.slice(0, 3);

  const shouldShowToggle = filteredOrders.length > 3;

  const handleDelete = id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this order?',
      [
        { text: 'Cancel', style: 'cancel' },
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
                Alert.alert(
                  'Error',
                  'Failed to delete order. Please try again.',
                );
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
            }
          },
        },
      ],
    );
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    Animated.spring(slideAnim, {
      toValue: tab === 'pending' ? 0 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleDateSelect = (date) => {
    try {
      const selectedDateObj = new Date(date.timestamp);
      setSelectedDate(selectedDateObj);
      setShowCalendar(false);
    } catch (error) {
      console.error('Error selecting date:', error);
    }
  };

  const getMarkedDates = () => {
    if (!selectedDate) return {};
    return {
      [formatDate(selectedDate)]: {
        selected: true,
        selectedColor: '#F7374F',
      },
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading orders: {error}</Text>
      </View>
    );
  }

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
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Header
          title="Upcoming Orders"
          showBackButton="arrow-back"
          navigation={navigation}
          rightIcon="add"
          onBackPress={() => navigation.navigate('MainTabs')}
          onRightIconPress={() => navigation.navigate('AddOrder')}
        />

        <View style={styles.filterContainer}>
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

          <TouchableOpacity
            style={[
              styles.dateFilterButton,
              selectedDate && styles.dateFilterButtonActive,
            ]}
            onPress={() => setShowCalendar(true)}>
            <Icon
              name="calendar-outline"
              size={f(2.5)}
              color={selectedDate ? '#FFFFFF' : '#F7374F'}
            />
            {selectedDate && (
              <View style={styles.dateFilterBadge}>
                <Text style={styles.dateFilterBadgeText}>1</Text>
              </View>
            )}
          </TouchableOpacity>

          {selectedDate && (
            <TouchableOpacity
              style={styles.clearDateButton}
              onPress={() => setSelectedDate(null)}>
              <Icon name="close-circle" size={f(2.5)} color="#F7374F" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tabContainer}>
          <View style={styles.tabBackground}>
            <Animated.View
              style={[
                styles.tabIndicator,
                {
                  transform: [
                    {
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [w(0.5), w(50)],
                      }),
                    },
                  ],
                },
              ]}
            />
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
              onPress={() => handleTabPress('pending')}>
              <Icon
                name="time-outline"
                size={f(2.2)}
                color={activeTab === 'pending' ? '#F7374F' : '#666'}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'pending' && styles.activeTabText,
                ]}>
                Pending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'confirmed' && styles.activeTab]}
              onPress={() => handleTabPress('confirmed')}>
              <Icon
                name="checkmark-circle-outline"
                size={f(2.2)}
                color={activeTab === 'confirmed' ? '#F7374F' : '#666'}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'confirmed' && styles.activeTabText,
                ]}>
                Confirmed
              </Text>
            </TouchableOpacity>
          </View>
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
          renderItem={({ item }) => (
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
              {searchQuery || activeTab !== 'all' ? null : (
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

        <Modal
          visible={showCalendar}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCalendar(false)}>
          <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.calendarContainer}>
                  <View style={styles.calendarHeader}>
                    <Text style={styles.calendarTitle}>Select Date</Text>
                    <TouchableOpacity
                      onPress={() => setShowCalendar(false)}
                      style={styles.closeButton}>
                      <Icon name="close" size={f(2.5)} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <RNCalendar
                    onDayPress={handleDateSelect}
                    maxDate={formatDate(new Date())}
                    markedDates={getMarkedDates()}
                    theme={{
                      calendarBackground: '#FFFFFF',
                      textSectionTitleColor: '#666',
                      selectedDayBackgroundColor: '#F7374F',
                      selectedDayTextColor: '#FFFFFF',
                      todayTextColor: '#F7374F',
                      dayTextColor: '#333',
                      textDisabledColor: '#999',
                      dotColor: '#F7374F',
                      selectedDotColor: '#FFFFFF',
                      arrowColor: '#F7374F',
                      monthTextColor: '#333',
                      indicatorColor: '#F7374F',
                      textDayFontSize: f(2),
                      textMonthFontSize: f(2.2),
                      textDayHeaderFontSize: f(2),
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
    shadowOffset: { width: 0, height: 4 },
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
    minWidth: w(8),
    minHeight: w(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    padding: w(1.5),
    marginLeft: w(1),
    backgroundColor: 'rgba(247, 55, 79, 0.1)',
    borderRadius: w(2),
    minWidth: w(8),
    minHeight: w(8),
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: w(4),
    paddingVertical: h(1),
    marginRight: w(2),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
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
  tabContainer: {
    marginHorizontal: w(4),
    marginTop: h(2),
    marginBottom: h(1),
  },
  tabBackground: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: w(3),
    padding: w(0.5),
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabIndicator: {
    position: 'absolute',
    width: w(43),
    height: h(5.5),
    backgroundColor: '#FFFFFF',
    borderRadius: w(2.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: h(1.2),
    paddingHorizontal: w(2),
    borderRadius: w(2.5),
    zIndex: 1,
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: f(2),
    color: '#666',
    fontWeight: '500',
    marginLeft: w(1),
  },
  activeTabText: {
    color: '#F7374F',
    fontWeight: '600',
  },
  tabIcon: {
    marginRight: w(1),
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: w(4),
    marginTop: Platform.OS === 'android' ? h(2) : 0,
    marginBottom: h(1),
  },
  dateFilterButton: {
    width: w(12),
    height: w(12),
    borderRadius: w(2),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F7374F',
  },
  dateFilterButtonActive: {
    backgroundColor: '#F7374F',
  },
  clearDateButton: {
    marginLeft: w(2),
    padding: w(1),
  },
  dateFilterBadge: {
    position: 'absolute',
    top: -w(1),
    right: -w(1),
    backgroundColor: '#FFFFFF',
    borderRadius: w(2),
    width: w(4),
    height: w(4),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F7374F',
  },
  dateFilterBadgeText: {
    color: '#F7374F',
    fontSize: f(1.5),
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: w(3),
    width: w(90),
    padding: w(4),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: h(2),
  },
  calendarTitle: {
    fontSize: f(2.5),
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: w(1),
  },
});
export default UpcomingOrders;