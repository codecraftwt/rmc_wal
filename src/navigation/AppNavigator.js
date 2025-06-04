import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../signinSignup/LoginScreen';
import MaterialScreen from '../screens/materialDispatch/MaterialScreen';
import MainTabs from './BottomTabNavigator';
import DetailsScreen from '../screens/materialDispatch/DetailsScreen';
import SignUpScreen from '../signinSignup/SignUpScreen';
import EditDispatchScreen from '../screens/materialDispatch/EditDispatchScreen';
import MaterialInward from '../screens/materialInward/MaterialInward';
import MaterialInwardDetails from '../screens/materialInward/MaterialInwardDetails';
import EditInwardScreen from '../screens/materialInward/EditInwardScreen';
import UpcomingOrders from '../screens/orders/UpcomingOrders';
import OrderDetails from '../screens/orders/OrderDetails';
import EditOrder from '../screens/orders/EditOrder';
import AddOrder from '../screens/orders/AddOrder';
import {useSelector} from 'react-redux';
import SplashScreen from '../signinSignup/SplashScreen';
import AddCustomers from '../screens/customers/AddCustomers';
import Customers from '../screens/customers/Customers';
import CustomerDetails from '../screens/customers/CustomerDetails';
import EditCustomer from '../screens/customers/EditCustomer';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const token = useSelector(state => state.auth.token);

  return (
    // <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      {token ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MaterialScreen"
            component={MaterialScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DetailsScreen"
            component={DetailsScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="EditDispatchScreen"
            component={EditDispatchScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MaterialInward"
            component={MaterialInward}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MaterialInwardDetails"
            component={MaterialInwardDetails}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="EditInwardScreen"
            component={EditInwardScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UpcomingOrders"
            component={UpcomingOrders}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OrderDetails"
            component={OrderDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EditOrder"
            component={EditOrder}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddOrder"
            component={AddOrder}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddCustomers"
            component={AddCustomers}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Customers"
            component={Customers}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CustomerDetails"
            component={CustomerDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditCustomers"
            component={EditCustomer}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
