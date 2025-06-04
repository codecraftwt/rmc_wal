import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    BackHandler,
    TextInput,
    Alert,
    Modal,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { h, w, f } from 'walstar-rn-responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/Header';
import { useDispatch, useSelector } from 'react-redux';
import { editCustomer, fetchCustomerFormData, resetEditCustomerState } from '../../../Redux/slices/orderSlice';

const CustomDropdown = ({
    value,
    onValueChange,
    items,
    placeholder,
    loading,
    style,
    getLabel = item => item.long_name,
    getValue = item => item.country_id,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState(items || []);

    useEffect(() => {
        if (value && items) {
            const selectedItem = items.find(item => getValue(item) === value);
            if (selectedItem) {
                setSelectedLabel(getLabel(selectedItem));
            } else {
                // If value exists but not found in items, try to find by direct value match
                const directMatch = items.find(item => item === value);
                if (directMatch) {
                    setSelectedLabel(getLabel(directMatch));
                } else {
                    // If it's a language value, capitalize it
                    if (typeof value === 'string' && value.length > 0) {
                        setSelectedLabel(value.charAt(0).toUpperCase() + value.slice(1));
                    } else {
                        setSelectedLabel(placeholder);
                    }
                }
            }
        } else {
            setSelectedLabel(placeholder);
        }
    }, [value, items, placeholder, getLabel, getValue]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredItems(items || []);
        } else {
            const filtered = (items || []).filter(item =>
                getLabel(item).toLowerCase().includes(searchQuery.toLowerCase()),
            );
            setFilteredItems(filtered);
        }
    }, [searchQuery, items, getLabel]);

    const handleSelect = item => {
        onValueChange(getValue(item));
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleClose = () => {
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <View style={[styles.customDropdownContainer, style]}>
            <TouchableOpacity
                style={styles.customDropdownButton}
                onPress={() => setIsOpen(true)}>
                <Text style={styles.customDropdownButtonText}>{selectedLabel}</Text>
                <Icon name="chevron-down" size={f(2.5)} color="#F7374F" />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={handleClose}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.dropdownContent}>
                                <LinearGradient
                                    colors={['#F7374F', '#FF6B6B']}
                                    style={styles.dropdownHeader}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}>
                                    <Text style={styles.dropdownTitle}>{placeholder}</Text>
                                    <TouchableOpacity
                                        onPress={handleClose}
                                        style={styles.closeButton}>
                                        <Icon name="close" size={f(2.5)} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </LinearGradient>

                                <View style={styles.searchContainer}>
                                    <View style={styles.searchInputContainer}>
                                        <Icon
                                            name="search"
                                            size={f(2.5)}
                                            color="#666"
                                            style={styles.searchIcon}
                                        />
                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                            placeholderTextColor="#999"
                                        />
                                        {searchQuery ? (
                                            <TouchableOpacity
                                                onPress={() => setSearchQuery('')}
                                                style={styles.clearSearchButton}>
                                                <Icon name="close-circle" size={f(2.5)} color="#666" />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                </View>

                                {loading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="small" color="#F7374F" />
                                    </View>
                                ) : (
                                    <ScrollView style={styles.dropdownList}>
                                        {filteredItems.length > 0 ? (
                                            filteredItems.map(item => (
                                                <TouchableOpacity
                                                    key={getValue(item)}
                                                    style={[
                                                        styles.dropdownItem,
                                                        value === getValue(item) &&
                                                        styles.dropdownItemSelected,
                                                    ]}
                                                    onPress={() => handleSelect(item)}>
                                                    <Text
                                                        style={[
                                                            styles.dropdownItemText,
                                                            value === getValue(item) &&
                                                            styles.dropdownItemTextSelected,
                                                        ]}>
                                                        {getLabel(item)}
                                                    </Text>
                                                    {value === getValue(item) && (
                                                        <Icon
                                                            name="checkmark"
                                                            size={f(2.5)}
                                                            color="#F7374F"
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            ))
                                        ) : (
                                            <View style={styles.noResultsContainer}>
                                                <Icon name="search-outline" size={f(5)} color="#999" />
                                                <Text style={styles.noResultsText}>
                                                    No results found
                                                </Text>
                                            </View>
                                        )}
                                    </ScrollView>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const EditCustomer = ({ route, navigation }) => {
    const { customer } = route.params;
    const dispatch = useDispatch();
    const { customerFormData = {}, customerFormDataLoading, editCustomerLoading, editCustomerSuccess, editCustomerError } = useSelector(
        state => state.order,
    );

    console.log('Customer data received:', customer); // Debug log

    const [formData, setFormData] = useState({
        name: customer.name || '',
        vat: customer.vat || '',
        phone: customer.phone || '',
        website: customer.website || '',
        country: customer.country || '',
        groups: customer.groups_in?.[0] || '',
        currency: customer.default_currency || '',
        language: customer.default_language || '',
        billing: {
            street: customer.billing?.street || '',
            city: customer.billing?.city || '',
            state: customer.billing?.state || '',
            zip: customer.billing?.zip || '',
            country: customer.billing?.country || '',
        },
        shipping: {
            street: customer.shipping?.street || '',
            city: customer.shipping?.city || '',
            state: customer.shipping?.state || '',
            zip: customer.shipping?.zip || '',
            country: customer.shipping?.country || '',
        },
    });

    const [billingExpanded, setBillingExpanded] = useState(true);
    const [shippingExpanded, setShippingExpanded] = useState(true);

    const copyBillingToShipping = () => {
        setFormData(prev => ({
            ...prev,
            shipping: { ...prev.billing }
        }));
    };

    // Debug log for initial form data
    useEffect(() => {
        console.log('Initial form data:', formData);
    }, []);

    useEffect(() => {
        dispatch(fetchCustomerFormData());
    }, [dispatch]);

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

    const handleInputChange = (field, value, section = null) => {
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Company name is required');
            return;
        }

        const customerData = {
            id: customer.id,
            company: formData.name,
            vat: formData.vat,
            phonenumber: formData.phone,
            country: formData.country,
            city: formData.billing.city,
            zip: formData.billing.zip,
            state: formData.billing.state,
            address: formData.billing.street,
            website: formData.website,
            default_currency: formData.currency,
            default_language: formData.language,
            billing_street: formData.billing.street,
            billing_city: formData.billing.city,
            billing_state: formData.billing.state,
            billing_zip: formData.billing.zip,
            billing_country: formData.billing.country,
            shipping_street: formData.shipping.street,
            shipping_city: formData.shipping.city,
            shipping_state: formData.shipping.state,
            shipping_zip: formData.shipping.zip,
            shipping_country: formData.shipping.country,
            groups_in: formData.groups ? [formData.groups] : [],
        };

        dispatch(editCustomer(customerData));
    };

    // Add effect to handle success/error states
    useEffect(() => {
        if (editCustomerSuccess) {
            Alert.alert('Success', 'Customer updated successfully', [
                {
                    text: 'OK',
                    onPress: () => {
                        dispatch(resetEditCustomerState());
                        navigation.goBack();
                    },
                },
            ]);
        }

        if (editCustomerError) {
            Alert.alert('Error', editCustomerError);
            dispatch(resetEditCustomerState());
        }
    }, [editCustomerSuccess, editCustomerError, navigation, dispatch]);

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
                    title="Edit Customer"
                    navigation={navigation}
                    showBackButton="arrow-back"
                />

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.card}>
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

                            <FormInput
                                icon="business-outline"
                                label="Company Name"
                                value={formData.name}
                                onChangeText={(value) => handleInputChange('name', value)}
                                placeholder="Enter company name"
                            />
                            <FormInput
                                icon="document-text-outline"
                                label="VAT Number"
                                value={formData.vat}
                                onChangeText={(value) => handleInputChange('vat', value)}
                                placeholder="Enter VAT number"
                            />
                            <FormInput
                                icon="call-outline"
                                label="Phone"
                                value={formData.phone}
                                onChangeText={(value) => handleInputChange('phone', value)}
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                            />
                            <FormInput
                                icon="globe-outline"
                                label="Website"
                                value={formData.website}
                                onChangeText={(value) => handleInputChange('website', value)}
                                placeholder="Enter website URL"
                                keyboardType="url"
                            />
                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldLabel}>
                                    <Icon
                                        name="globe-outline"
                                        size={f(2.5)}
                                        color="#F7374F"
                                        style={styles.fieldIcon}
                                    />
                                    <Text style={styles.labelText}>Country</Text>
                                </View>
                                <CustomDropdown
                                    value={formData.country}
                                    onValueChange={(value) => handleInputChange('country', value)}
                                    items={customerFormData?.countries || []}
                                    placeholder="Select a country"
                                    loading={customerFormDataLoading}
                                    style={styles.pickerContainer}
                                    getLabel={item => item.long_name}
                                    getValue={item => item.country_id}
                                />
                            </View>
                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldLabel}>
                                    <Icon
                                        name="people"
                                        size={f(2.5)}
                                        color="#F7374F"
                                        style={styles.fieldIcon}
                                    />
                                    <Text style={styles.labelText}>Groups</Text>
                                </View>
                                <CustomDropdown
                                    value={formData.groups}
                                    onValueChange={(value) => handleInputChange('groups', value)}
                                    items={customerFormData?.customers_groups || []}
                                    placeholder={formData.groups ? customerFormData?.customers_groups?.find(g => g.id === formData.groups)?.name : "Select a group"}
                                    loading={customerFormDataLoading}
                                    style={styles.pickerContainer}
                                    getLabel={item => item.name}
                                    getValue={item => item.id}
                                />
                            </View>
                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldLabel}>
                                    <Icon
                                        name="cash"
                                        size={f(2.5)}
                                        color="#F7374F"
                                        style={styles.fieldIcon}
                                    />
                                    <Text style={styles.labelText}>Currency</Text>
                                </View>
                                <CustomDropdown
                                    value={formData.currency}
                                    onValueChange={(value) => handleInputChange('currency', value)}
                                    items={customerFormData?.currencies || []}
                                    placeholder="Select a currency"
                                    loading={customerFormDataLoading}
                                    style={styles.pickerContainer}
                                    getLabel={item => `${item.name} (${item.symbol})`}
                                    getValue={item => item.id}
                                />
                            </View>
                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldLabel}>
                                    <Icon
                                        name="language"
                                        size={f(2.5)}
                                        color="#F7374F"
                                        style={styles.fieldIcon}
                                    />
                                    <Text style={styles.labelText}>Language</Text>
                                </View>
                                <CustomDropdown
                                    value={formData.language}
                                    onValueChange={(value) => handleInputChange('language', value)}
                                    items={customerFormData?.languages || []}
                                    placeholder="Select a language"
                                    loading={customerFormDataLoading}
                                    style={styles.pickerContainer}
                                    getLabel={item => item.charAt(0).toUpperCase() + item.slice(1)}
                                    getValue={item => item}
                                />
                            </View>
                        </View>

                        <View style={styles.detailSection}>
                            <TouchableOpacity
                                style={styles.sectionHeader}
                                onPress={() => setBillingExpanded(!billingExpanded)}>
                                <View style={styles.sectionHeaderContent}>
                                    <Icon name="location-outline" size={f(2.5)} color="#F7374F" />
                                    <Text style={styles.sectionTitle}>Billing Address</Text>
                                </View>
                                <Icon
                                    name={billingExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={f(2.5)}
                                    color="#F7374F"
                                />
                            </TouchableOpacity>

                            {billingExpanded && (
                                <View style={styles.addressSection}>
                                    <FormInput
                                        icon="home-outline"
                                        label="Street"
                                        value={formData.billing.street}
                                        onChangeText={(value) => handleInputChange('street', value, 'billing')}
                                        placeholder="Enter street address"
                                    />
                                    <FormInput
                                        icon="business-outline"
                                        label="City"
                                        value={formData.billing.city}
                                        onChangeText={(value) => handleInputChange('city', value, 'billing')}
                                        placeholder="Enter city"
                                    />
                                    <FormInput
                                        icon="map-outline"
                                        label="State"
                                        value={formData.billing.state}
                                        onChangeText={(value) => handleInputChange('state', value, 'billing')}
                                        placeholder="Enter state"
                                    />
                                    <FormInput
                                        icon="mail-outline"
                                        label="ZIP Code"
                                        value={formData.billing.zip}
                                        onChangeText={(value) => handleInputChange('zip', value, 'billing')}
                                        placeholder="Enter ZIP code"
                                        keyboardType="numeric"
                                    />
                                    <View style={styles.fieldContainer}>
                                        <View style={styles.fieldLabel}>
                                            <Icon
                                                name="flag"
                                                size={f(2.5)}
                                                color="#F7374F"
                                                style={styles.fieldIcon}
                                            />
                                            <Text style={styles.labelText}>Country</Text>
                                        </View>
                                        <CustomDropdown
                                            value={formData.billing.country}
                                            onValueChange={(value) => handleInputChange('country', value, 'billing')}
                                            items={customerFormData?.countries || []}
                                            placeholder={formData.billing.country ? customerFormData?.countries?.find(c => c.country_id === formData.billing.country)?.long_name : "Select a country"}
                                            loading={customerFormDataLoading}
                                            style={styles.pickerContainer}
                                            getLabel={item => item.long_name}
                                            getValue={item => item.country_id}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        <View style={styles.detailSection}>
                            <TouchableOpacity
                                style={styles.sectionHeader}
                                onPress={() => setShippingExpanded(!shippingExpanded)}>
                                <View style={styles.sectionHeaderContent}>
                                    <Icon name="car-outline" size={f(2.5)} color="#F7374F" />
                                    <Text style={styles.sectionTitle}>Shipping Address</Text>
                                </View>
                                <Icon
                                    name={shippingExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={f(2.5)}
                                    color="#F7374F"
                                />
                            </TouchableOpacity>

                            {shippingExpanded && (
                                <View style={styles.addressSection}>
                                    <TouchableOpacity
                                        style={styles.sameAsBillingButton}
                                        onPress={copyBillingToShipping}>
                                        <Icon name="copy-outline" size={f(2)} color="#4CAF50" />
                                        <Text style={styles.sameAsBillingText}>
                                            Same as Billing Address
                                        </Text>
                                    </TouchableOpacity>

                                    <FormInput
                                        icon="home-outline"
                                        label="Street"
                                        value={formData.shipping.street}
                                        onChangeText={(value) => handleInputChange('street', value, 'shipping')}
                                        placeholder="Enter street address"
                                    />
                                    <FormInput
                                        icon="business-outline"
                                        label="City"
                                        value={formData.shipping.city}
                                        onChangeText={(value) => handleInputChange('city', value, 'shipping')}
                                        placeholder="Enter city"
                                    />
                                    <FormInput
                                        icon="map-outline"
                                        label="State"
                                        value={formData.shipping.state}
                                        onChangeText={(value) => handleInputChange('state', value, 'shipping')}
                                        placeholder="Enter state"
                                    />
                                    <FormInput
                                        icon="mail-outline"
                                        label="ZIP Code"
                                        value={formData.shipping.zip}
                                        onChangeText={(value) => handleInputChange('zip', value, 'shipping')}
                                        placeholder="Enter ZIP code"
                                        keyboardType="numeric"
                                    />
                                    <View style={styles.fieldContainer}>
                                        <View style={styles.fieldLabel}>
                                            <Icon
                                                name="flag"
                                                size={f(2.5)}
                                                color="#F7374F"
                                                style={styles.fieldIcon}
                                            />
                                            <Text style={styles.labelText}>Country</Text>
                                        </View>
                                        <CustomDropdown
                                            value={formData.shipping.country}
                                            onValueChange={(value) => handleInputChange('country', value, 'shipping')}
                                            items={customerFormData?.countries || []}
                                            placeholder={formData.shipping.country ? customerFormData?.countries?.find(c => c.country_id === formData.shipping.country)?.long_name : "Select a country"}
                                            loading={customerFormDataLoading}
                                            style={styles.pickerContainer}
                                            getLabel={item => item.long_name}
                                            getValue={item => item.country_id}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => navigation.goBack()}
                                disabled={editCustomerLoading}>
                                <Icon name="close-outline" size={f(2.5)} color="#F7374F" />
                                <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.saveButton]}
                                onPress={handleSubmit}
                                disabled={editCustomerLoading}>
                                {editCustomerLoading ? (
                                    <ActivityIndicator size="small" color="#4CAF50" />
                                ) : (
                                    <>
                                        <Icon name="save-outline" size={f(2.5)} color="#4CAF50" />
                                        <Text style={[styles.actionButtonText, styles.saveButtonText]}>Save Changes</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const FormInput = ({ icon, label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
        <View style={styles.inputLabelContainer}>
            <View style={styles.inputIcon}>
                <Icon name={icon} size={f(2.2)} color="#4A90E2" />
            </View>
            <Text style={styles.inputLabel}>{label}</Text>
        </View>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            keyboardType={keyboardType}
        />
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
    inputContainer: {
        marginBottom: h(2),
    },
    inputLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: h(1),
    },
    inputIcon: {
        width: w(7),
        height: w(7),
        borderRadius: w(3.5),
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: w(2),
    },
    inputLabel: {
        fontSize: f(1.8),
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: w(2),
        paddingHorizontal: w(4),
        paddingVertical: h(1.5),
        fontSize: f(2),
        color: '#333',
        backgroundColor: '#F8FAFF',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: h(2),
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: h(1.5),
        paddingHorizontal: w(4),
        borderRadius: w(2),
        borderWidth: 1,
        flex: 1,
        marginHorizontal: w(2),
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: 'rgba(247, 55, 79, 0.1)',
        borderColor: 'rgba(247, 55, 79, 0.3)',
    },
    saveButton: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: 'rgba(76, 175, 80, 0.3)',
    },
    actionButtonText: {
        fontSize: f(2),
        fontFamily: 'Poppins-Medium',
        marginLeft: w(2),
    },
    cancelButtonText: {
        color: '#F7374F',
    },
    saveButtonText: {
        color: '#4CAF50',
    },
    customDropdownContainer: {
        width: '100%',
    },
    customDropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: w(2),
        padding: w(3),
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    customDropdownButtonText: {
        fontSize: f(2),
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownContent: {
        backgroundColor: 'white',
        borderRadius: w(3),
        width: '85%',
        maxHeight: h(60),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: w(4),
        borderTopLeftRadius: w(3),
        borderTopRightRadius: w(3),
    },
    dropdownTitle: {
        fontSize: f(2.4),
        fontWeight: '600',
        color: '#FFFFFF',
        fontFamily: 'Poppins-SemiBold',
    },
    closeButton: {
        padding: w(1),
    },
    searchContainer: {
        padding: w(3),
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: w(2),
        paddingHorizontal: w(3),
        paddingVertical: w(2),
    },
    searchIcon: {
        marginRight: w(2),
    },
    searchInput: {
        flex: 1,
        fontSize: f(2),
        color: '#333',
        padding: w(2),
        fontFamily: 'Poppins-Regular',
    },
    clearSearchButton: {
        padding: w(1),
    },
    dropdownList: {
        maxHeight: h(45),
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: w(3),
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    dropdownItemSelected: {
        backgroundColor: '#FFF5F6',
    },
    dropdownItemText: {
        fontSize: f(2),
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
    dropdownItemTextSelected: {
        color: '#F7374F',
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    noResultsContainer: {
        padding: w(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    noResultsText: {
        fontSize: f(2),
        color: '#666',
        marginTop: h(2),
        fontFamily: 'Poppins-Regular',
    },
    pickerContainer: {
        backgroundColor: '#F5F7FA',
        borderRadius: w(2),
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
    },
    fieldContainer: {
        marginBottom: h(2),
    },
    fieldLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: h(1),
    },
    fieldIcon: {
        marginRight: w(2),
    },
    labelText: {
        fontSize: f(1.8),
        color: '#666',
    },
    sectionHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressSection: {
        paddingTop: h(2),
    },
    sameAsBillingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        padding: w(3),
        borderRadius: w(2),
        marginBottom: h(2),
    },
    sameAsBillingText: {
        color: '#4CAF50',
        marginLeft: w(2),
        fontSize: f(2),
        fontFamily: 'Poppins-Medium',
    },
});

export default EditCustomer; 