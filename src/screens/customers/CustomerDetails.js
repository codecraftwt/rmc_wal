import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    BackHandler,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { h, w, f } from 'walstar-rn-responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCustomers } from '../../../Redux/slices/orderSlice';
import { useFocusEffect } from '@react-navigation/native';

const CustomerDetails = ({ route, navigation }) => {
    const { customer: initialCustomer } = route.params;
    const dispatch = useDispatch();
    const { customerFormData = {}, customers = [] } = useSelector(state => state.order);
    const [customer, setCustomer] = React.useState(initialCustomer);
    const [loading, setLoading] = React.useState(false);
    const [shouldRefresh, setShouldRefresh] = React.useState(false);

    const getCountryName = (countryId) => {
        if (!countryId) return 'N/A';
        const country = customerFormData.countries?.find(c => c.country_id === countryId);
        return country ? country.long_name : 'N/A';
    };

    const formatLanguage = (lang) => {
        if (!lang) return 'N/A';
        return lang.charAt(0).toUpperCase() + lang.slice(1);
    };

    const formatCurrency = (curr) => {
        if (!curr) return 'N/A';
        const currency = customerFormData.currencies?.find(c => c.id === curr);
        return currency ? `${currency.name} (${currency.symbol})` : 'N/A';
    };

    useFocusEffect(
        React.useCallback(() => {
            const refreshData = async () => {
                if (shouldRefresh) {
                    setLoading(true);
                    try {
                        await dispatch(fetchCustomers()).unwrap();
                        const updatedCustomer = customers.find(c => c.id === initialCustomer.id);
                        if (updatedCustomer) {
                            setCustomer(updatedCustomer);
                        }
                    } catch (error) {
                        console.error('Error refreshing customer data:', error);
                    } finally {
                        setLoading(false);
                        setShouldRefresh(false);
                    }
                }
            };

            refreshData();
        }, [shouldRefresh, dispatch, initialCustomer.id, customers])
    );

    const handleEditPress = () => {
        setShouldRefresh(true);
        navigation.navigate('EditCustomers', { customer });
    };

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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F7374F" />
                <Text style={styles.loadingText}>Loading customer details...</Text>
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
            <View style={styles.container}>
                <Header
                    title="Customer Details"
                    navigation={navigation}
                    showBackButton="arrow-back"
                />

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.customerInfo}>
                                <LinearGradient
                                    colors={['#4A90E2', '#5D9DF5']}
                                    style={styles.avatar}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}>
                                    <Icon name="business" size={f(3)} color="#FFF" />
                                </LinearGradient>
                                <Text style={styles.customerName}>{customer.name}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: '#4CAF50' }]}>
                                <Text style={styles.statusText}>Active</Text>
                            </View>
                        </View>

                        <View style={styles.detailSection}>
                            <View style={styles.sectionHeader}>
                                <LinearGradient
                                    colors={['#F7374F', '#FF8A65']}
                                    style={styles.sectionIcon}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}>
                                    <Icon name="information-circle-outline" size={f(2.5)} color="white" />
                                </LinearGradient>
                                <Text style={styles.sectionTitle}>Basic Information</Text>
                            </View>

                            <DetailRow
                                icon="document-text-outline"
                                label="VAT Number:"
                                value={customer.vat || 'N/A'}
                            />
                            <DetailRow
                                icon="call-outline"
                                label="Phone:"
                                value={customer.phone || 'N/A'}
                            />
                            <DetailRow
                                icon="globe-outline"
                                label="Website:"
                                value={customer.website || 'N/A'}
                            />
                            <DetailRow
                                icon="language"
                                label="Language:"
                                value={formatLanguage(customer.default_language)}
                            />
                            <DetailRow
                                icon="cash"
                                label="Currency:"
                                value={formatCurrency(customer.default_currency)}
                            />
                            <DetailRow
                                icon="flag"
                                label="Country:"
                                value={getCountryName(customer.country)}
                            />
                        </View>

                        <View style={styles.detailSection}>
                            <View style={styles.sectionHeader}>
                                <LinearGradient
                                    colors={['#F7374F', '#FF8A65']}
                                    style={styles.sectionIcon}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}>
                                    <Icon name="location-outline" size={f(2.5)} color="white" />
                                </LinearGradient>
                                <Text style={styles.sectionTitle}>Billing Address</Text>
                            </View>

                            <DetailRow
                                icon="home-outline"
                                label="Street:"
                                value={customer.billing.street || 'N/A'}
                            />
                            <DetailRow
                                icon="business-outline"
                                label="City:"
                                value={customer.billing.city || 'N/A'}
                            />
                            <DetailRow
                                icon="map-outline"
                                label="State:"
                                value={customer.billing.state || 'N/A'}
                            />
                            <DetailRow
                                icon="mail-outline"
                                label="ZIP Code:"
                                value={customer.billing.zip || 'N/A'}
                            />
                            <DetailRow
                                icon="flag"
                                label="Country:"
                                value={getCountryName(customer.billing.country)}
                            />
                        </View>

                        <View style={styles.detailSection}>
                            <View style={styles.sectionHeader}>
                                <LinearGradient
                                    colors={['#F7374F', '#FF8A65']}
                                    style={styles.sectionIcon}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}>
                                    <Icon name="car-outline" size={f(2.5)} color="white" />
                                </LinearGradient>
                                <Text style={styles.sectionTitle}>Shipping Address</Text>
                            </View>

                            <DetailRow
                                icon="home-outline"
                                label="Street:"
                                value={customer.shipping.street || 'N/A'}
                            />
                            <DetailRow
                                icon="business-outline"
                                label="City:"
                                value={customer.shipping.city || 'N/A'}
                            />
                            <DetailRow
                                icon="map-outline"
                                label="State:"
                                value={customer.shipping.state || 'N/A'}
                            />
                            <DetailRow
                                icon="mail-outline"
                                label="ZIP Code:"
                                value={customer.shipping.zip || 'N/A'}
                            />
                            <DetailRow
                                icon="flag"
                                label="Country:"
                                value={getCountryName(customer.shipping.country)}
                                lastItem
                            />
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.editButton]}
                                onPress={handleEditPress}>
                                <Icon name="create-outline" size={f(2.5)} color="#4A90E2" />
                                <Text style={styles.actionButtonText}>Edit Customer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const DetailRow = ({ icon, label, value, lastItem }) => (
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
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: h(2),
        paddingBottom: h(2),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    customerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: w(10),
        height: w(10),
        borderRadius: w(5),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: w(3),
    },
    customerName: {
        fontSize: f(2.6),
        color: '#333',
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: w(3.5),
        paddingVertical: h(0.8),
        borderRadius: w(5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
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
    actionButtonText: {
        fontSize: f(2),
        fontFamily: 'Poppins-Medium',
        marginLeft: w(2),
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
    },
});

export default CustomerDetails; 