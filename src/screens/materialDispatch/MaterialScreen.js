import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  BackHandler,
  Modal,
  Pressable
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {h, w, f} from 'walstar-rn-responsive';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../component/Header';
import DateTimePicker from '@react-native-community/datetimepicker';

const data = [
  {
    id: '1',
    product_grade: 'M-20',
    customer_name: 'John Doe',
    vehicle_no: 'ABC123',
    date: '2025-03-28',
    driver_name: 'Mike Ross',
    out_time: '10:00 AM',
    amount: '10000',
    total_cost: '20000',
    quantity: '3',
  },
  {
    id: '2',
    product_grade: 'M-25',
    customer_name: 'Jane Smith',
    vehicle_no: 'XYZ789',
    date: '2025-03-29',
    driver_name: 'Harvey Specter',
    out_time: '11:30 AM',
    amount: '15000',
    total_cost: '30000',
    quantity: '4',
  },
  {
    id: '3',
    product_grade: 'M-30',
    customer_name: 'Robert Johnson',
    vehicle_no: 'DEF456',
    date: '2025-03-30',
    driver_name: 'Louis Litt',
    out_time: '02:15 PM',
    amount: '12000',
    total_cost: '24000',
    quantity: '2',
  },
  {
    id: '4',
    product_grade: 'M-35',
    customer_name: 'Emily Davis',
    vehicle_no: 'GHI789',
    date: '2025-03-31',
    driver_name: 'Donna Paulsen',
    out_time: '09:45 AM',
    amount: '18000',
    total_cost: '36000',
    quantity: '5',
  },
];

const MaterialScreen = ({navigation}) => {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [dateFilterApplied, setDateFilterApplied] = useState(false);

  useEffect(() => {
    filterData();
  }, [searchQuery, dateFilterApplied, startDate, endDate]);

  const filterData = () => {
    let filtered = [...data];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => {
        const productMatch = item.product_grade
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const driverMatch = item.driver_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return productMatch || driverMatch;
      });
    }
    
    // Apply date filter if applied
    if (dateFilterApplied) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    setFilteredData(filtered);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainTabs'); 
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const displayedData = showAll
    ? filteredData
    : filteredData.slice(0, 3);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const applyDateFilter = () => {
    setDateFilterApplied(true);
    setShowDateFilter(false);
  };

  const clearDateFilter = () => {
    setDateFilterApplied(false);
    setStartDate(new Date());
    setEndDate(new Date());
    setShowDateFilter(false);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('DetailsScreen', {dispatchData: item})
      }>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Customer: {item.customer_name}</Text>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Icon
          name="star-half"
          size={f(2)}
          color="#F7374F"
          style={styles.icon}
        />
        <Text style={styles.cardText}>Product Grade: {item.product_grade}</Text>
      </View>

      <View style={styles.cardRow}>
        <Icon
          name="car-outline"
          size={f(2)}
          color="#F7374F"
          style={styles.icon}
        />
        <Text style={styles.cardText}>Vehicle: {item.vehicle_no}</Text>
      </View>

      <View style={styles.cardRow}>
        <Icon
          name="person-outline"
          size={f(2)}
          color="#F7374F"
          style={styles.icon}
        />
        <Text style={styles.cardText}>Driver: {item.driver_name}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.amountText}>Amount: {item.amount}₹</Text>
        <Text style={styles.costText}>Total: {item.total_cost}₹</Text>
      </View>
    </TouchableOpacity>
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
      <View style={styles.container}>
        <Header title="Material Dispatch" navigation={navigation} showBackButton='arrow-back'/>

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={f(2.5)}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by product or driver"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            onPress={() => setShowDateFilter(true)}
            style={styles.filterButton}
          >
            <Icon 
              name="calendar" 
              size={f(2.5)} 
              color={dateFilterApplied ? "#F7374F" : "#888"} 
            />
          </TouchableOpacity>
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={f(2.5)} color="#888" />
            </TouchableOpacity>
          ) : null}
        </View>

        <FlatList
          data={displayedData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.listHeaderContainer}>
              <Text style={styles.listHeader}>Recent Dispatches</Text>
              {filteredData.length > 3 && (
                <TouchableOpacity
                  onPress={toggleShowAll}
                  style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>
                    {showAll ? 'Show Less' : 'See All'}
                  </Text>
                  <Icon
                    name={showAll ? 'chevron-up' : 'chevron-down'}
                    size={f(2)}
                    color="#F7374F"
                  />
                </TouchableOpacity>
              )}
            </View>
          }
          ListFooterComponent={
            displayedData.length === 0 ? (
              <Text style={styles.emptyText}>No dispatches found</Text>
            ) : null
          }
        />

        {/* Date Filter Modal */}
        <Modal
          visible={showDateFilter}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDateFilter(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filter by Date Range</Text>
              
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>From:</Text>
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text>{formatDate(startDate)}</Text>
                  <Icon name="calendar" size={f(2)} color="#888" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>To:</Text>
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text>{formatDate(endDate)}</Text>
                  <Icon name="calendar" size={f(2)} color="#888" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalButtonContainer}>
                <Pressable 
                  style={[styles.modalButton, styles.clearButton]}
                  onPress={clearDateFilter}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
                <Pressable 
                  style={[styles.modalButton, styles.applyButton]}
                  onPress={applyDateFilter}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}
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
    backgroundColor: '#f5f5f7',
  },
  listContent: {
    paddingHorizontal: w(4),
    paddingTop: h(2),
    paddingBottom: h(4),
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
  card: {
    backgroundColor: '#ffffff',
    padding: w(5),
    marginBottom: h(2),
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 5.4,
    borderLeftColor: '#ff9e68',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: h(1.5),
  },
  cardTitle: {
    fontSize: f(2),
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  dateBadge: {
    backgroundColor: '#FFE8E8',
    paddingHorizontal: w(3),
    paddingVertical: h(0.5),
    borderRadius: 10,
  },
  dateText: {
    fontSize: f(1.8),
    color: '#F7374F',
    fontWeight: '500',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(1),
  },
  icon: {
    marginRight: w(2),
  },
  cardText: {
    fontSize: f(2),
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: h(1.5),
    paddingTop: h(1),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  amountText: {
    fontSize: f(2),
    color: '#4CAF50',
    fontWeight: '500',
  },
  costText: {
    fontSize: f(2.1),
    fontWeight: '600',
    color: '#F7374F',
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
  },
  filterButton: {
    marginLeft: w(2),
    marginRight: w(1),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: w(5),
    width: w(80),
  },
  modalTitle: {
    fontSize: f(2.5),
    fontWeight: '600',
    color: '#333',
    marginBottom: h(2),
    textAlign: 'center',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(2),
  },
  dateLabel: {
    width: w(15),
    fontSize: f(2),
    color: '#333',
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: w(3),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: h(2),
  },
  modalButton: {
    flex: 1,
    padding: h(1.5),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    backgroundColor: '#f5f5f7',
    marginRight: w(2),
  },
  applyButton: {
    backgroundColor: '#F7374F',
    marginLeft: w(2),
  },
  clearButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default MaterialScreen;