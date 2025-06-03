import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {h, w, f} from 'walstar-rn-responsive';
import Header from '../../component/Header';
import {fetchMaterialInward} from '../../../Redux/slices/materialInwardSlice';

const MaterialInward = ({navigation}) => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.materialInward);
  console.log(data, ' data-----');

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

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.card,
        item.payment_status === '1' ? styles.paidCard : styles.pendingCard,
      ]}
      onPress={() =>
        navigation.navigate('MaterialInwardDetails', {material: item})
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
              {color: item.payment_status === '1' ? '#4CAF50' : '#FF9800'},
            ]}>
            {item.payment_method_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading material inward data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{padding: 20}}>
        <Text style={{color: 'red', textAlign: 'center'}}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <Header title="Material Inward" /> */}

      <Header
        title="Material Inward"
        navigation={navigation}
        showBackButton="arrow-back"
        style={{
          paddingTop: h(6.4),
        }}
      />
      <View style={styles.container}>
        <TextInput
          placeholder="Search by material, vehicle or description"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        <FlatList
          data={displayedData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
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
                      style={{marginLeft: 5}}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'blue',
    paddingVertical: 10,
  },
  container: {flex: 1, padding: 15},
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  paidCard: {
    borderLeftWidth: 5,
    borderLeftColor: 'green',
  },
  pendingCard: {
    borderLeftWidth: 5,
    borderLeftColor: 'orange',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: f(2.2),
    fontWeight: 'bold',
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  paidBadge: {backgroundColor: '#E8F5E9'},
  pendingBadge: {backgroundColor: '#FFF3E0'},
  statusText: {color: '#333', fontWeight: 'bold'},
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardText: {
    fontSize: f(1.8),
    color: '#333',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: h(1.5),
    paddingTop: h(1.5),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  amountText: {
    fontSize: f(2.2),
    fontWeight: '700',
    color: '#F7374F',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: f(1.9),
    fontWeight: '600',
    marginLeft: w(1),
  },
  toggleText: {
    textAlign: 'center',
    padding: 10,
    color: '#007bff',
    fontWeight: 'bold',
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: h(2),
  },
  listHeader: {
    fontSize: f(2.5),
    fontWeight: '600',
    color: '#333',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#F7374F',
    fontSize: f(2),
    fontWeight: '600',
    marginRight: w(1),
  },
  emptyText: {
    textAlign: 'center',
    fontSize: f(2),
    color: '#666',
    marginTop: h(3),
  },
  seeAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MaterialInward;
