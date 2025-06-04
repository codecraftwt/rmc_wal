import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    BackHandler,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { h, w, f } from 'walstar-rn-responsive';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../../../Redux/slices/orderSlice';
import { useFocusEffect } from '@react-navigation/native';

const CustomerCard = ({ customer, onPress, navigation }) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(customer)}
            activeOpacity={0.8}>
            <View style={styles.cardHeader}>
                <View style={styles.customerInfo}>
                    <LinearGradient
                        colors={['#4A90E2', '#5D9DF5']}
                        style={styles.avatar}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}>
                        <Icon name="business" size={f(2.5)} color="#FFF" />
                    </LinearGradient>
                    <Text style={styles.customerName}>{customer.name}</Text>
                </View>
                <View style={styles.actionIcons}>
                    <TouchableOpacity
                        style={[styles.iconButton, styles.editButton]}
                        onPress={() => navigation.navigate('EditCustomers', { customer })}>
                        <Icon name="create-outline" size={f(2.2)} color="#4A90E2" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.iconButton, styles.deleteButton]}
                        onPress={() => {
                            Alert.alert(
                                'Delete Customer',
                                'Are you sure you want to delete this customer?',
                                [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Delete',
                                        onPress: () => {
                                            // Add delete functionality here
                                            console.log('Delete customer:', customer.id);
                                        },
                                        style: 'destructive',
                                    },
                                ],
                            );
                        }}>
                        <Icon name="trash-outline" size={f(2.2)} color="#F7374F" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.detailRow}>
                <View style={styles.iconCircle}>
                    <Icon name="call-outline" size={f(2.2)} color="#4A90E2" />
                </View>
                <Text style={styles.detailText}>
                    {customer.phone || 'No phone number'}
                </Text>
            </View>

            <View style={styles.detailRow}>
                <View style={styles.iconCircle}>
                    <Icon name="location-outline" size={f(2.2)} color="#4A90E2" />
                </View>
                <Text style={styles.detailText} numberOfLines={1}>
                    {customer.address || 'No address'}
                </Text>
            </View>

            <View style={styles.detailRow}>
                <View style={styles.iconCircle}>
                    <Icon name="business-outline" size={f(2.2)} color="#4A90E2" />
                </View>
                <Text style={styles.detailText}>
                    {customer.city || 'No city'} {customer.state ? `, ${customer.state}` : ''}
                </Text>
            </View>
        </TouchableOpacity>
    );
};


const Customers = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const dispatch = useDispatch();
    const { customers, customersLoading, customersError } = useSelector(
        state => state.order,
    );

    console.log('customerspage', customers)

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchCustomers());
        }, [dispatch]),
    );

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

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.address?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (customersLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text>Loading customers...</Text>
            </View>
        );
    }

    if (customersError) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading customers: {customersError}</Text>
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
                    title="Customers"
                    showBackButton="arrow-back"
                    navigation={navigation}
                    rightIcon="add"
                    onBackPress={() => navigation.navigate('MainTabs')}
                    onRightIconPress={() => navigation.navigate('AddCustomers')}
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
                        placeholder="Search customers..."
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

                <FlatList
                    data={filteredCustomers}
                    renderItem={({ item }) => (
                        <CustomerCard
                            customer={item}
                            onPress={(customer) => navigation.navigate('CustomerDetails', { customer })}
                            navigation={navigation}
                        />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="people-outline" size={f(8)} color="#CCCCCC" />
                            <Text style={styles.emptyText}>No customers found</Text>
                        </View>
                    }
                />

                {selectedCustomer && (
                    <CustomerDetails
                        customer={selectedCustomer}
                        onClose={() => setSelectedCustomer(null)}
                    />
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: w(4),
        paddingVertical: h(1),
        margin: w(4),
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
    listContent: {
        padding: w(4),
        paddingBottom: h(4),
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
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: w(2),
    },
    iconButton: {
        width: w(8),
        height: w(8),
        borderRadius: w(4),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: w(2),
    },
    editButton: {
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
    },
    deleteButton: {
        backgroundColor: 'rgba(247, 55, 79, 0.1)',
    },
});

export default Customers;
