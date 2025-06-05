import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  BackHandler,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { h, w, f } from 'walstar-rn-responsive';
import Header from '../../component/Header';
import { fetchMaterialInward } from '../../../Redux/slices/materialInwardSlice';
import LinearGradient from 'react-native-linear-gradient';

const MaterialInward = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.materialInward);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(fetchMaterialInward());

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

  useEffect(() => {
    const filtered = data.filter(item => {
      const materialMatch = item.material_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const vehicleMatch = item.vehicle_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descriptionMatch = item.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      return materialMatch || vehicleMatch || descriptionMatch;
    });
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const toggleShowAll = () => setShowAll(!showAll);

  const displayedData = showAll
    ? searchQuery
      ? filteredData
      : data
    : (searchQuery ? filteredData : data).slice(0, 3);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        item.payment_status === '1' ? styles.paidCard : styles.pendingCard,
      ]}
      onPress={() =>
        navigation.navigate('MaterialInwardDetails', { material: item })
      }
      activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Material: {item.material_name}</Text>
        <View
          style={[
            styles.statusBadge,
            item.payment_status === '1'
              ? styles.paidBadge
              : styles.pendingBadge,
          ]}>
          <Text style={styles.statusText}>
            {item.payment_status === '1' ? 'Paid' : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Icon
          name="calendar-outline"
          size={f(2)}
          color="#666"
          style={styles.cardIcon}
        />
        <Text style={styles.cardText}>{item.date}</Text>
      </View>

      <View style={styles.cardRow}>
        <Icon
          name="car-outline"
          size={f(2)}
          color="#666"
          style={styles.cardIcon}
        />
        <Text style={styles.cardText}>Vehicle No: {item.vehicle_number}</Text>
      </View>

      {item.description && (
        <View style={styles.cardRow}>
          <Icon
            name="document-text-outline"
            size={f(2)}
            color="#666"
            style={styles.cardIcon}
          />
          <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
            {item.description}
          </Text>
        </View>
      )}

      {/* <View style={styles.cardFooter}>
        <Text style={styles.amountText}>
          Total Bill: ₹{item.total_bill_amount}
        </Text>
      </View> */}

      <View style={styles.cardFooter}>
        <Text style={styles.amountText}>
          Total Bill: ₹{item.total_bill_amount}
        </Text>
        <View style={styles.paymentStatus}>
          <Icon
            name={
              item.payment_status === '1' ? 'checkmark-circle' : 'time-outline'
            }
            size={f(2)}
            color={item.payment_status === '1' ? '#4CAF50' : '#FF9800'}
          />
          <Text
            style={[
              styles.paymentText,
              { color: item.payment_status === '1' ? '#4CAF50' : '#FF9800' },
            ]}>
            {item.payment_method_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F7374F" />
        <Text style={styles.loadingText}>Loading material inward data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
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

      <View style={styles.mainContainer}>
        <Header
          title="Material Inward"
          navigation={navigation}
          showBackButton="arrow-back"
        />

        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={f(2.5)} color="#666" style={styles.searchIcon} />
            <TextInput
              placeholder="Search by material, vehicle or description"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
          </View>

          <FlatList
            data={displayedData}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.listHeaderContainer}>
                <Text style={styles.listHeader}>Recent Material Inwards</Text>

                {(searchQuery ? filteredData : data).length > 3 && (
                  <TouchableOpacity
                    onPress={toggleShowAll}
                    style={styles.seeAllButton}>
                    <View style={styles.seeAllContent}>
                      <Text style={styles.seeAllText}>
                        {showAll ? 'Show Less' : 'See All'}
                      </Text>
                      <Icon
                        name={showAll ? 'chevron-up' : 'chevron-down'}
                        size={f(2)}
                        color="#F7374F"
                        style={styles.seeAllIcon}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        </View>
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  container: {
    flex: 1,
    padding: w(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
  },
  loadingText: {
    marginTop: h(2),
    fontSize: f(2),
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: w(5),
    backgroundColor: '#F8FAFF',
  },
  errorText: {
    color: '#F7374F',
    fontSize: f(2),
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: w(2),
    paddingHorizontal: w(3),
    marginBottom: h(2),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: w(2),
  },
  searchInput: {
    flex: 1,
    height: Platform.OS === 'ios' ? h(5) : h(4.5),
    fontSize: f(2),
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  listContainer: {
    paddingBottom: h(2),
  },
  card: {
    borderRadius: w(2),
    padding: w(4),
    marginBottom: h(2),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paidCard: {
    borderLeftWidth: w(0.5),
    borderLeftColor: '#4CAF50',
  },
  pendingCard: {
    borderLeftWidth: w(0.5),
    borderLeftColor: '#FF9800',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: h(1),
  },
  cardTitle: {
    fontSize: f(2.2),
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    borderRadius: w(2),
    paddingHorizontal: w(3),
    paddingVertical: h(0.5),
  },
  paidBadge: {
    backgroundColor: '#E8F5E9',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    color: '#333',
    fontSize: f(1.8),
    fontFamily: 'Poppins-SemiBold',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: h(0.5),
  },
  cardIcon: {
    marginRight: w(2),
  },
  cardText: {
    fontSize: f(1.8),
    color: '#666',
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: h(2),
    paddingTop: h(2),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  amountText: {
    fontSize: f(2.2),
    fontFamily: 'Poppins-SemiBold',
    color: '#F7374F',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: f(1.9),
    fontFamily: 'Poppins-SemiBold',
    marginLeft: w(1),
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: h(2),
  },
  listHeader: {
    fontSize: f(2.5),
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#F7374F',
    fontSize: f(2),
    fontFamily: 'Poppins-SemiBold',
    marginRight: w(1),
  },
  seeAllIcon: {
    marginLeft: w(1),
  },
});

export default MaterialInward;
